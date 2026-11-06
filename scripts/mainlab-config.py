"""Generate a private 49-byte main.lab without running received executables."""
import argparse
import getpass
import ipaddress
import re
from pathlib import Path

def encode(host,serial):
    if not isinstance(host,str) or not isinstance(serial,str):raise ValueError('Text fields required')
    if not 1<=len(host)<=31 or not host.isascii():raise ValueError('Host must fit 31 ASCII bytes')
    if re.fullmatch(r'[0-9.]+',host):
        try:ipaddress.IPv4Address(host)
        except ipaddress.AddressValueError:raise ValueError('Invalid IPv4 address') from None
    elif any(not re.fullmatch(r'[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?',part) for part in host.split('.')):
        raise ValueError('Invalid host name')
    if len(serial)!=16 or not serial.isascii() or any(ord(c)<33 or ord(c)>126 for c in serial):
        raise ValueError('Serial must contain exactly 16 printable ASCII characters')
    data=host.encode().ljust(32,b'\0')+serial.encode()+b'\0'
    return bytes((((value^(0xfd^index))-0xb7)&255) for index,value in enumerate(data))

def write_private(output,data):
    output=Path(output).resolve();project=Path(__file__).resolve().parents[1]
    if output.is_relative_to(project):raise ValueError('Keep main.lab outside the Git repository')
    if len(data)!=49:raise ValueError('Expected 49 bytes')
    with output.open('xb') as stream:stream.write(data)

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--host',default='127.0.0.1');parser.add_argument('--output',type=Path,required=True);args=parser.parse_args()
    try:
        serial=getpass.getpass('Serial do pacote (não será exibido): ')
        write_private(args.output,encode(args.host,serial))
        print('main.lab gerado: 49 bytes. Não foi iniciado nenhum executável.')
    except (ValueError,OSError) as error:
        print(type(error).__name__+': não foi possível gerar o arquivo; confira campos e destino novo.')
        raise SystemExit(1)
