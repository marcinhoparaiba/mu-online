# O cliente recusa 127.0.0.1. Grava o IP de rede no Configs.gbt e no ServerList.dat.
# Uso: python ajustar_ip.py <ip>   -> imprime "mudou" se o ServerList foi alterado.
import re, sys
from pathlib import Path
ip = sys.argv[1]
root = Path(__file__).resolve().parent.parent
key = bytes.fromhex("f29554")
xor = lambda d: bytes(b ^ key[i % 3] for i, b in enumerate(d))
cfg = root / "2 - Cliente/Data/Configs/Configs.gbt"
x = bytearray(xor(cfg.read_bytes()))
new = ip.encode().ljust(32, b"\0")
if x[32:64] != new:
    x[32:64] = new
    cfg.write_bytes(xor(bytes(x)))
sl = root / "1 - MuServer 97d+5.2 Aprendizmuonline/ConnectServer/ServerList.dat"
t = sl.read_bytes().decode("cp1252")
n = re.sub(r'"\d+\.\d+\.\d+\.\d+"', f'"{ip}"', t)
if n != t:
    sl.write_bytes(n.encode("cp1252"))
    print("mudou")
