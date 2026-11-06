"""Prepare fresh compile-only MSBuild recipes; never run package projects or binaries."""
import argparse
import hashlib
import json
import shutil
from pathlib import Path
import xml.etree.ElementTree as ET

NS='http://schemas.microsoft.com/developer/msbuild/2003'
ET.register_namespace('', NS)
def element(parent,tag,text=None,**attributes):
    node=ET.SubElement(parent,'{'+NS+'}'+tag,attributes)
    if text is not None: node.text=text
    return node

def prepare(source,output):
    source=source.resolve(strict=True);output=output.resolve()
    if not source.is_dir() or output.is_relative_to(source):
        raise ValueError('Output must be outside the source directory')
    if output.exists(): raise ValueError('Refusing to overwrite an existing lab')
    inputs=[]
    for project in sorted(source.rglob('*.vcxproj')):
        if project.is_symlink(): raise ValueError('Linked project rejected')
        cpp=[]
        for node in ET.parse(project).iter():
            if node.tag.rsplit('}',1)[-1]=='ClCompile' and node.get('Include'):
                raw=node.get('Include').replace('\\','/')
                if any(char in raw for char in ['$','*',';']): raise ValueError('Dynamic source path rejected')
                path=(project.parent/raw).resolve(strict=True)
                if not path.is_relative_to(source) or path.suffix.lower()!='.cpp':
                    raise ValueError('Source path outside package rejected')
                cpp.append(path.relative_to(source))
        if cpp: inputs.append((project.relative_to(source),cpp))
    output.mkdir(parents=True)
    hashes=[]
    for path in sorted(source.rglob('*')):
        if not path.is_file() or path.suffix.lower() not in {'.cpp','.h','.hpp','.inl'}: continue
        if path.is_symlink() or not path.resolve().is_relative_to(source): raise ValueError('Linked source rejected')
        dest=output/'source'/path.relative_to(source);dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(path,dest)
        hashes.append({'path':path.relative_to(source).as_posix(),'sha256':hashlib.sha256(dest.read_bytes()).hexdigest()})
    projects=[]
    for index,(original,cpp) in enumerate(inputs):
        label=str(index)+'-'+original.parent.parent.name+'-'+original.stem
        directory=output/'recipes'/label;directory.mkdir(parents=True)
        root=ET.Element('{'+NS+'}Project',{'DefaultTargets':'ClCompile','ToolsVersion':'Current'})
        items=element(root,'ItemGroup',Label='ProjectConfigurations')
        config=element(items,'ProjectConfiguration',Include='Release|Win32')
        element(config,'Configuration','Release');element(config,'Platform','Win32')
        globals=element(root,'PropertyGroup',Label='Globals');element(globals,'WindowsTargetPlatformVersion','10.0.26100.0')
        element(root,'Import',Project='$(VCTargetsPath)\\Microsoft.Cpp.Default.props')
        props=element(root,'PropertyGroup',Label='Configuration');element(props,'PlatformToolset','v143');element(props,'ConfigurationType','StaticLibrary');element(props,'CharacterSet','MultiByte')
        element(root,'Import',Project='$(VCTargetsPath)\\Microsoft.Cpp.props')
        dirs=element(root,'PropertyGroup');element(dirs,'IntDir','$(ProjectDir)obj\\');element(dirs,'OutDir','$(ProjectDir)out\\')
        definitions=element(root,'ItemDefinitionGroup');compile=element(definitions,'ClCompile')
        element(compile,'PrecompiledHeader','NotUsing');element(compile,'WarningLevel','Level3');element(compile,'RuntimeLibrary','MultiThreaded');element(compile,'PreprocessorDefinitions','WIN32;NDEBUG;_CRT_SECURE_NO_WARNINGS;%(PreprocessorDefinitions)')
        items=element(root,'ItemGroup')
        for relative in cpp: element(items,'ClCompile',Include=str(output/'source'/relative))
        element(root,'Import',Project='$(VCTargetsPath)\\Microsoft.Cpp.targets')
        target=directory/'compile-only.vcxproj';ET.ElementTree(root).write(target,encoding='utf-8',xml_declaration=True);projects.append(target)
    (output/'private-build-inputs.json').write_text(json.dumps({'inputs':hashes,'projects':[str(p.relative_to(output)) for p in projects]},indent=2),encoding='utf-8')
    return projects

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--source',type=Path,required=True);parser.add_argument('--output',type=Path,required=True);args=parser.parse_args()
    for project in prepare(args.source,args.output): print(project)
