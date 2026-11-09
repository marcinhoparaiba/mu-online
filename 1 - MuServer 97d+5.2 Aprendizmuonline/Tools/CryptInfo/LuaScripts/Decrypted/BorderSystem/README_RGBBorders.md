# Sistema de Bordas RGB Configurável via Lua

## Visão Geral

Este documento explica como usar o sistema de bordas RGB configurável via Lua, que permite personalizar completamente as cores das bordas dos itens no inventário.

## Estrutura do Sistema

### Arquivos Principais

- **RGBBorderManager.h/cpp**: Gerenciador principal do sistema de bordas RGB
- **RGBBorders.lua**: Arquivo de configuração Lua com personalizações
- **NewUIMyInventory.cpp**: Interface atualizada para usar o novo sistema

### Como Funciona

O sistema verifica configurações na seguinte ordem de prioridade:

1. **Configurações Específicas de Item**: Cores definidas para itens específicos
2. **Configurações de Categoria**: Cores definidas para categorias de itens
3. **Sistema Padrão**: Cores baseadas em nível, durabilidade, etc.

## Configuração via Lua

### Estrutura Básica

```lua
-- Configuração para item específico
customItemBorders[GET_ITEM_MODEL(categoria, índice)] = {
    minLevel = 15,        -- Nível mínimo
    minOption1 = 7,       -- Option1 mínimo (Excellent = 7)
    color = {r, g, b, a}, -- Cores RGB + Alpha (0.0 a 1.0)
    thickness = 4.0,      -- Espessura da borda
    effect = 1,           -- Tipo de efeito (0-7)
    speed = 2.0,          -- Velocidade da animação
    enabled = true        -- Se está habilitado
}
```

### Tipos de Efeitos

- **0 = Default**: Cor estática
- **1 = Rainbow**: Arco-íris rotativo
- **2 = Pulse**: Pulsação
- **3 = Glow**: Brilho crescente/decrescente
- **4 = Breathing**: Respiração suave
- **5 = Wave**: Onda de cor
- **6 = Sparkle**: Cintilação
- **7 = Static**: Cor fixa personalizada

### Exemplos de Configuração

#### Item Específico - Sword of Assassin Excellent
```lua
customItemBorders[GET_ITEM_MODEL(0, 4)] = {
    minLevel = 15,
    minOption1 = 7,  -- Excellent
    color = {1.0, 0.0, 1.0, 0.8},  -- Magenta vibrante
    thickness = 4.0,
    effect = 1,  -- Rainbow
    speed = 2.0,
    enabled = true
}
```

#### Categoria Inteira - Todas as Espadas
```lua
categoryBorders[0] = {
    minLevel = 12,
    minOption1 = 0,
    color = {0.9, 0.2, 0.2, 0.5},  -- Vermelho suave
    thickness = 2.0,
    effect = 0,  -- Static
    speed = 1.0,
    enabled = true
}
```

## Funções Auxiliares

### Gerenciamento em Tempo Real

```lua
-- Adicionar nova configuração
AddCustomItemBorder(0, 5, 10, 0, 1.0, 0.0, 0.0, 0.8, 3.0, 2, 2.0)

-- Remover configuração
RemoveCustomItemBorder(0, 5)

-- Listar configurações ativas
ListCustomBorders()

-- Desabilitar/habilitar todas
DisableAllCustomBorders()
EnableAllCustomBorders()
```

### Obter ID do Item

```lua
-- Usar GET_ITEM_MODEL para calcular o ID
local itemId = GET_ITEM_MODEL(categoria, índice)
-- Exemplo: GET_ITEM_MODEL(0, 4) = Sword of Assassin
```

## Categorias de Itens

- **0**: Espadas (Swords)
- **1**: Machados (Axes)
- **2**: Cetros/Maças (Maces/Scepters)
- **3**: Lanças (Spears)
- **4**: Arcos (Bows)
- **5**: Cajados (Staffs)
- **6**: Escudos (Shields)
- **7**: Capacetes (Helms)
- **8**: Armaduras (Armors)
- **9**: Calças (Pants)
- **10**: Luvas (Gloves)
- **11**: Botas (Boots)
- **12**: Anéis (Rings)
- **13**: Colares (Pendants)

## Cores Recomendadas

### Cores por Qualidade
- **Excellent**: Dourado `{1.0, 0.84, 0.0, 0.8}`
- **Skill**: Azul `{0.0, 0.5, 1.0, 0.7}`
- **Normal**: Cinza `{0.8, 0.8, 0.8, 0.6}`

### Cores por Elemento
- **Fogo**: Vermelho `{1.0, 0.2, 0.0, 0.7}`
- **Gelo**: Azul claro `{0.7, 0.9, 1.0, 0.7}`
- **Raio**: Amarelo `{1.0, 1.0, 0.3, 0.8}`
- **Terra**: Marrom `{0.6, 0.4, 0.2, 0.6}`

## Performance

### Otimizações
- Configurações são carregadas uma vez na inicialização
- Cache é usado para configurações frequentes
- Animações são atualizadas a ~60 FPS
- Sistema pode ser desabilitado globalmente

### Limites Recomendados
- **Máximo de configurações específicas**: 100 itens
- **Espessura da borda**: 1.0 a 5.0 pixels
- **Velocidade de animação**: 0.5 a 5.0
- **Alpha**: 0.3 a 1.0 para visibilidade adequada

## Depuração

### Comandos Úteis
```lua
-- Ver todas as configurações
ListCustomBorders()

-- Testar novo item
AddCustomItemBorder(0, 1, 0, 0, 1.0, 0.0, 0.0, 0.8, 3.0, 2, 1.5)

-- Recarregar configurações
-- (Reiniciar o cliente ou recarregar o arquivo Lua)
```

### Logs do Sistema
O sistema exibe logs no console indicando:
- Configurações carregadas
- Itens testados
- Erros de configuração

## Compatibilidade

### Com Sistema Existente
- Totalmente compatível com bordas automáticas por nível
- Configurações customizadas têm prioridade
- Sistema pode ser desabilitado sem afetar funcionalidade

### Atualizações Futuras
- Arquivo de configuração pode ser atualizado sem recompilar
- Novas funções podem ser adicionadas facilmente
- Sistema modular permite extensões

## Solução de Problemas

### Problemas Comuns

1. **Configuração não funciona**
   - Verificar sintaxe Lua
   - Confirmar categoria/índice corretos
   - Checar se `enabled = true`

2. **Cores não aparecem**
   - Verificar valores RGB (0.0 a 1.0)
   - Confirmar alpha > 0.3
   - Testar com espessura maior

3. **Efeitos não funcionam**
   - Verificar número do efeito (0-7)
   - Testar com velocidade diferente
   - Confirmar se sistema de animação está ativo

### Valores Seguros para Teste
```lua
-- Configuração básica e segura
{
    minLevel = 0,
    minOption1 = 0,
    color = {1.0, 0.0, 0.0, 0.8},  -- Vermelho visível
    thickness = 3.0,
    effect = 0,  -- Sem animação
    speed = 1.0,
    enabled = true
}
```

## Exemplos Prontos

### Kit Completo para Testes
```lua
-- Sword of Assassin arco-íris
AddCustomItemBorder(0, 4, 10, 0, 1.0, 0.0, 1.0, 0.8, 3.0, 1, 2.0)

-- Kris dourado pulsante
AddCustomItemBorder(0, 0, 13, 0, 1.0, 0.84, 0.0, 0.7, 3.5, 2, 1.5)

-- Todas as espadas +15 vermelhas
categoryBorders[0] = {
    minLevel = 15,
    minOption1 = 0,
    color = {1.0, 0.0, 0.0, 0.6},
    thickness = 2.5,
    effect = 3,
    speed = 1.0,
    enabled = true
}
```
