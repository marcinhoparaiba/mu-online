import importlib.util
import tempfile
import unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('lab',Path(__file__).resolve().parents[1]/'scripts/prepare-build-lab.py')
lab=importlib.util.module_from_spec(spec)
spec.loader.exec_module(lab)
class LabTests(unittest.TestCase):
 def test_generates_only_compile_recipe_without_received_tasks_or_binaries(self):
  with tempfile.TemporaryDirectory() as d:
   source=Path(d)/'source';source.mkdir();(source/'a.cpp').write_text('int a=1;');(source/'a.h').write_text('#pragma once');(source/'bad.dll').write_bytes(b'not copied')
   (source/'p.vcxproj').write_text('<Project><ItemGroup><ClCompile Include="a.cpp"/></ItemGroup><Target Name="evil"><Exec Command="bad.exe"/></Target></Project>')
   output=Path(d)/'lab';projects=lab.prepare(source,output)
   text=projects[0].read_text();self.assertNotIn('bad.exe',text);self.assertNotIn('evil',text);self.assertNotIn('CustomBuild',text);self.assertFalse((output/'source/bad.dll').exists());self.assertIn('v143',text);self.assertIn('NotUsing',text)
   self.assertEqual((output/'source/a.cpp').read_text(),'int a=1;')
 def test_rejects_outside_source_and_output_overwrite(self):
  with tempfile.TemporaryDirectory() as d:
   source=Path(d)/'source';source.mkdir();(source/'p.vcxproj').write_text('<Project><ClCompile Include="../outside.cpp"/></Project>');(Path(d)/'outside.cpp').write_text('int a;')
   with self.assertRaises(ValueError):lab.prepare(source,Path(d)/'lab')
   with self.assertRaises(ValueError):lab.prepare(source,source/'lab')
if __name__=='__main__':unittest.main()
