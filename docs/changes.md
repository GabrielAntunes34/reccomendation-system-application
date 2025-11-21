# Mudanças

Este arquivo mantém algumas mudanças e decisões nao documentadas formamlemte

## Quanto ao BD

- atributo model de Product foi trocado para ser do tipo string
- Atribtuto name foi adcionado a Product
- Atributo quantity foi removido de collections
- Adcionado o atributo disponible em Product

### Alterações em interaction

Tabela completamente reformulada para conter esses atributos:
```
User_id
Product_id
Viewed: num
Liked: bool
Contacted: bool
```
