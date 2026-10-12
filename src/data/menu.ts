export type Diet = 'V' | 'VG' | 'GF';

export interface Dish {
  name: string;
  desc?: string;
  price: string;
  extras?: string;
  tags?: Diet[];
}

export const MAIN: Dish[] = [
  { name: 'Greek salad', desc: 'Tomatoes, cucumber, feta, olive oil, seasoning', price: '£11' },
  { name: 'Cauliflower steak', desc: 'Beetroot purée, nuts, parsnip crisps, herb oil', price: '£14', tags: ['VG'] },
  { name: 'Home-made pine nut pesto penne', desc: 'House pesto, wild mushrooms, white wine, garlic', extras: 'Add Parmesan £1', price: '£14', tags: ['VG'] },
  { name: 'Fish & chips', desc: 'Home-made beer batter, chunky chips, garden peas, tartare sauce', price: '£16' },
  { name: 'Chicken Caesar salad', desc: 'White-wine-cooked chicken breast, garlic croutons, baby gem, home-made dressing, anchovies, Parmesan shavings', price: '£14' },
  { name: 'Grilled cauliflower burger', desc: 'Battered cauliflower, avocado, beetroot, lettuce, mayo', price: '£15', tags: ['V'] },
  { name: 'Crispy chicken burger', desc: 'Iceberg, crunchy onion, tomato, brioche, garlic mayo', price: '£16' },
  { name: 'The Magic Burger', desc: '8oz home-made beef burger, tomato relish, caramelised onions, coleslaw, enriched cream bun, fries', extras: 'Add cheese £1, bacon £1', price: '£16' },
  { name: 'Spaghetti carbonara', desc: 'Cured pork, Parmesan, eggs, salt and black pepper', price: '£14' },
  { name: 'Steak of the week', desc: 'Peppercorn sauce, buttered new potatoes, charred broccoli', price: '£24' },
];

export const LIGHT: Dish[] = [
  { name: 'Soup of the day', desc: 'Cream of mushroom with truffle, toasted ciabatta', price: '£7', tags: ['V'] },
  { name: 'Buffalo cauliflower wings', desc: 'Spicy chilli sauce', price: '£8', tags: ['VG'] },
  { name: 'Toasted goat’s cheese & beetroot salad', desc: 'Beetroot glaze, walnuts, pesto', price: '£10', tags: ['V'] },
  { name: 'Chilli beef strips', desc: 'Miso-cured beef, chilli, sweet chilli sauce', price: '£9' },
  { name: 'Teriyaki chicken thighs', desc: 'Home-made teriyaki, spring onion, chilli', price: '£9' },
  { name: 'Salt & pepper crispy squid', desc: 'House cornflour mix', price: '£9', tags: ['GF'] },
  { name: 'Home-made Scotch egg', desc: 'English mustard', price: '£8' },
];

export const SIDES: Dish[] = [
  { name: 'Charred tenderstem broccoli', price: '£6', tags: ['VG', 'GF'] },
  { name: 'Skin-on skinny fries', price: '£5', tags: ['VG', 'GF'] },
  { name: 'Sweet potato fries', price: '£6', tags: ['VG', 'GF'] },
  { name: 'Chunky chips', price: '£6', tags: ['VG', 'GF'] },
  { name: 'Parmesan truffle fries', price: '£8', tags: ['V'] },
];

export const PUDDINGS: Dish[] = [
  { name: 'English cheese board', desc: 'Home-made artisan bread and crackers, quince paste, British cheeses', price: '£12.50' },
  { name: 'Sticky toffee pudding', price: '£6' },
  { name: 'Chocolate brownie', price: '£6' },
  { name: 'Ice cream', desc: '2 scoops: chocolate, vanilla, strawberry', price: '£5' },
];

export interface PartyMenu {
  id: string;
  set: string;
  name: string;
  price: string;
  groups: { label?: string; items: string[] }[];
}

export const PARTY_MENUS: PartyMenu[] = [
  {
    id: 'canape-finger',
    set: 'Set one',
    name: 'Canapé & finger food',
    price: '£20',
    groups: [
      {
        items: [
          'Tomato & goat’s cheese tart', 'Smoked salmon, crème fraîche & chives', 'Vegetable tempura with sweet chilli',
          'Mixed potato salad', 'Chicken satay', 'Teriyaki chicken bites', 'Crispy cauliflower', 'Mini quiches',
        ],
      },
    ],
  },
  {
    id: 'canapes',
    set: 'Set two',
    name: 'Canapés',
    price: '£28',
    groups: [
      {
        items: [
          'Fish & chips', 'Thai salmon roll', 'Thai beef', 'Smoked salmon, crème fraîche & chives',
          'Spinach & cep mushroom wellington', 'Shepherd’s pie', 'Teriyaki chicken bites', 'Crispy cauliflower',
          'Asparagus tempura', 'Mini quiches',
        ],
      },
    ],
  },
  {
    id: 'magic-buffet',
    set: 'Set three',
    name: 'Magic Buffet',
    price: '£37.50',
    groups: [
      { label: 'Canapés', items: ['Tomato & goat’s cheese tart', 'Smoked salmon with crème fraîche & chives', 'Vegetable tempura', 'Chicken satay', 'Mini quiches'] },
      { label: 'Mains', items: ['Roast beef with all the trimmings', 'Vegetarian wellington', 'Salmon en croute with saffron sauce'] },
      { label: 'Desserts', items: ['Sticky toffee pudding', 'Baked vanilla cheesecake'] },
    ],
  },
];
