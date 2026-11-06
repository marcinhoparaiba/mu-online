import importlib.util
import tempfile
import unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('config',Path(__file__).resolve().parents[1]/'scripts/mainlab-config.py')
config=importlib.util.module_from_spec(spec);spec.loader.exec_module(config)
class MainLabTests(unittest.TestCase):
 def test_known_49_byte_fixture(self):
  self.assertEqual(config.encode('127.0.0.1','0123456789ABCDEF').hex(),'15171119121f141d0d3d403f3a393c3b36353837323134332e2d302f2a292c2b36363636363636363636dfdddbdddfdd16')
 def test_rejects_truncation_and_invalid_connection_fields(self):
  for host,serial in [('999.1.1.1','0123456789ABCDEF'),('a'*32,'0123456789ABCDEF'),('127.0.0.1','short'),('bad/host','0123456789ABCDEF'),('127.0.0.1','0123456789ABCDE\x00')]:
   with self.assertRaises(ValueError):config.encode(host,serial)
 def test_writer_does_not_overwrite_and_forbids_public_project_output(self):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d)/'main.lab';data=config.encode('127.0.0.1','0123456789ABCDEF');config.write_private(p,data);self.assertEqual(p.read_bytes(),data)
   with self.assertRaises(FileExistsError):config.write_private(p,data)
  with self.assertRaises(ValueError):config.write_private(Path(__file__).resolve().parent/'must-not-create.lab',data)
if __name__=='__main__':unittest.main()
