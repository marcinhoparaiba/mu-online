import test from 'node:test';
import assert from 'node:assert/strict';
import { formatPost } from '../forum-format.js';
test('formatação permite ênfase, código e citação sem interpretar HTML do usuário',()=>{
 assert.equal(formatPost('**Olá** *mundo* `codigo`'),'<strong>Olá</strong> <em>mundo</em> <code>codigo</code>');
 assert.equal(formatPost('> Citação\nTexto'),'<blockquote>Citação</blockquote>\nTexto');
 const malicious=formatPost('**<img src=x onerror=alert(1)>**\n`<script>alert(1)</script>`\n[teste](javascript:alert(1))');
 assert.ok(!malicious.includes('<img'));assert.ok(!malicious.includes('<script'));assert.ok(!malicious.includes('<a'));
 assert.ok(malicious.includes('&lt;script&gt;'));
});
