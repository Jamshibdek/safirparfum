// Mock ma'lumotlar generatori: `npm run data` -> data/*.json
// Backend tayyor bo'lgach, bu fayllar API javoblari bilan almashtiriladi.
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'data')
mkdirSync(root, { recursive: true })
const out = (name, data) => writeFileSync(join(root, name), JSON.stringify(data, null, 2) + '\n')

// ---------- lug'atlar ----------
const NOTES = {
  bergamot: ['bergamot', 'бергамот'], lemon: ['limon', 'лимон'], grapefruit: ['greypfrut', 'грейпфрут'],
  mandarin: ['mandarin', 'мандарин'], pinkpepper: ['pushti qalampir', 'розовый перец'], blackpepper: ['qora qalampir', 'чёрный перец'],
  cardamom: ['kardamon', 'кардамон'], saffron: ['za\'faron', 'шафран'], lavender: ['lavanda', 'лаванда'],
  geranium: ['geran', 'герань'], rose: ['atirgul', 'роза'], jasmine: ['yasmin', 'жасмин'], iris: ['iris', 'ирис'],
  tuberose: ['tuberoza', 'тубероза'], peony: ['pion', 'пион'], neroli: ['neroli', 'нероли'],
  orangeblossom: ['apelsin guli', 'цветок апельсина'], vanilla: ['vanil', 'ваниль'], tonka: ['tonka loviya', 'бобы тонка'],
  amber: ['ambra', 'амбра'], musk: ['mushk', 'мускус'], sandalwood: ['sandal', 'сандал'], cedar: ['sadr', 'кедр'],
  vetiver: ['vetiver', 'ветивер'], patchouli: ['pachuli', 'пачули'], oud: ['ud', 'уд'], leather: ['teri', 'кожа'],
  tobacco: ['tamaki', 'табак'], coffee: ['qahva', 'кофе'], caramel: ['karamel', 'карамель'], almond: ['bodom', 'миндаль'],
  cherry: ['olcha', 'вишня'], apple: ['olma', 'яблоко'], pear: ['nok', 'груша'], blackcurrant: ['qora smorodina', 'чёрная смородина'],
  marine: ['dengiz notalari', 'морские ноты'], mint: ['yalpiz', 'мята'], sage: ['shalfey', 'шалфей'], ambroxan: ['ambroksan', 'амброксан'],
  incense: ['ladan', 'ладан'], honey: ['asal', 'мёд'], cinnamon: ['dolchin', 'корица'], coconut: ['kokos', 'кокос'],
  tea: ['choy', 'чай'], fig: ['anjir', 'инжир'], pineapple: ['ananas', 'ананас'], birch: ['qayin', 'берёза'], plum: ['olxo\'ri', 'слива'],
  linden: ['jo\'ka guli', 'липовый цвет'], ginger: ['zanjabil', 'имбирь']
}

const FAMILIES = {
  floral: ['Gulli', 'Цветочный'], oriental: ['Sharqona', 'Восточный'], woody: ['Yog\'ochli', 'Древесный'],
  citrus: ['Sitrusli', 'Цитрусовый'], fougere: ['Fujer', 'Фужерный'], fruity: ['Mevali', 'Фруктовый'],
  aquatic: ['Suvli', 'Водный'], gourmand: ['Shirin (gurmand)', 'Гурманский'], leather: ['Teri', 'Кожаный'], spicy: ['Ziravorli', 'Пряный']
}

const SEASONS = { spring: ['bahor', 'весна'], summer: ['yoz', 'лето'], autumn: ['kuz', 'осень'], winter: ['qish', 'зима'] }

const BRANDS = [
  ['safir', 'Sefir Parfum', 'Uzbekistan'],
  ['dior', 'Dior', 'France'], ['chanel', 'Chanel', 'France'], ['tom-ford', 'Tom Ford', 'USA'], ['ysl', 'Yves Saint Laurent', 'France'],
  ['armani', 'Giorgio Armani', 'Italy'], ['versace', 'Versace', 'Italy'], ['creed', 'Creed', 'France'],
  ['mfk', 'Maison Francis Kurkdjian', 'France'], ['xerjoff', 'Xerjoff', 'Italy'], ['kilian', 'Kilian Paris', 'France'],
  ['initio', 'Initio', 'France'], ['pdm', 'Parfums de Marly', 'France'], ['guerlain', 'Guerlain', 'France'],
  ['lancome', 'Lancôme', 'France'], ['byredo', 'Byredo', 'Sweden'], ['le-labo', 'Le Labo', 'USA'],
  ['montale', 'Montale', 'France'], ['amouage', 'Amouage', 'Oman']
].map(([slug, name, country], i) => ({ slug, name, country, sort: i }))
const brandName = Object.fromEntries(BRANDS.map(b => [b.slug, b.name]))

// Mijozning haqiqiy atirlari (rasm va videolar rasmvidio papkasidan, public/media ga siqilgan).
// Notalar va narxlar namunaviy — mijoz tasdiqlagach almashtiriladi.
// [... P bilan bir xil ustunlar ..., media: { img: [...], vid: [...] }]
const REAL = [
  ['AURA 19+ for women', 'safir', 'women', ['floral', 'gourmand'], ['pinkpepper', 'pear'], ['rose', 'jasmine'], ['vanilla', 'musk'], ['autumn', 'winter', 'spring'], 'evening', 4, 4, 'Extrait', 790000, 0, 'square', '#F2B8B5', 'gold', 'top', { img: ['aura-women-1', 'aura-women-2'], vid: ['aura-women-1', 'aura-women-2'], fit: 'cover' }],
  ['AURA 21+ for men', 'safir', 'men', ['woody', 'spicy'], ['bergamot', 'cardamom'], ['lavender', 'leather'], ['amber', 'vetiver', 'cedar'], ['autumn', 'winter'], 'evening', 5, 4, 'Extrait', 790000, 0, 'square', '#9AA6B8', 'silver', 'top', { img: ['aura-men-1'], vid: ['aura-men-1'], fit: 'cover' }],
  ['Pacific Chill', 'safir', 'unisex', ['citrus', 'fruity'], ['lemon', 'mandarin', 'mint'], ['blackcurrant', 'fig'], ['musk', 'ambroxan'], ['spring', 'summer'], 'day', 3, 3, 'Extrait', 690000, 10, 'tall', '#BFE3DC', 'silver', 'new', { img: ['pacific-chill-1', 'pacific-chill-2'], vid: ['lv-set-1'] }],
  ['Louis Vuitton Imagination', 'safir', 'men', ['citrus', 'woody'], ['bergamot', 'lemon', 'ginger'], ['tea', 'cinnamon'], ['ambroxan', 'incense', 'cedar'], ['spring', 'summer', 'autumn'], 'any', 4, 3, 'Extrait', 690000, 0, 'tall', '#D9E4EE', 'silver', 'new', { img: ['imagination-1'], vid: ['lv-set-1'] }],
  ['Louis Vuitton Symphony', 'safir', 'unisex', ['citrus', 'aquatic'], ['grapefruit', 'bergamot', 'ginger'], ['tea'], ['amber', 'musk'], ['spring', 'summer'], 'day', 3, 3, 'Extrait', 690000, 0, 'tall', '#F3C6D3', 'gold', 'new', { img: ['symphony-1'], vid: ['symphony-1', 'symphony-2', 'symphony-3'] }],
  ['Lost in Paris', 'safir', 'women', ['fruity', 'floral'], ['blackcurrant', 'pinkpepper'], ['rose', 'peony'], ['musk', 'patchouli'], ['spring', 'autumn'], 'any', 4, 3, 'Extrait', 690000, 0, 'square', '#F4D7DA', 'gold', 'new', { img: ['lost-in-paris-1'], vid: ['lost-in-paris-1'] }],
  ['Hormone Gaba', 'safir', 'unisex', ['oriental', 'spicy'], ['saffron', 'pinkpepper'], ['rose', 'oud'], ['amber', 'musk'], ['autumn', 'winter'], 'evening', 5, 4, 'Extrait', 690000, 0, 'square', '#E8D6C0', 'gold', null, { img: ['hormone-gaba-1'], vid: [] }],
  ['Tilia', 'safir', 'unisex', ['floral', 'fruity'], ['pear', 'mandarin'], ['linden', 'jasmine'], ['musk', 'vanilla'], ['spring', 'summer'], 'day', 3, 3, 'Extrait', 690000, 0, 'square', '#EFE7C8', 'gold', null, { img: ['tilia-1'], vid: [] }],
  ['Aurica', 'safir', 'unisex', ['oriental', 'floral'], ['bergamot', 'mandarin'], ['rose', 'jasmine'], ['amber', 'vanilla', 'sandalwood'], ['autumn', 'winter'], 'evening', 4, 4, 'Extrait', 690000, 15, 'square', '#E9C88E', 'gold', null, { img: ['aurica-1'], vid: [] }],
  ['Boadicea Aqua Sapphire', 'safir', 'unisex', ['aquatic', 'woody'], ['marine', 'bergamot', 'mint'], ['geranium'], ['cedar', 'musk', 'ambroxan'], ['summer', 'spring'], 'day', 4, 3, 'Extrait', 690000, 0, 'square', '#BCD4EA', 'gold', null, { img: ['aqua-sapphire-1'], vid: [] }],
  ['Bvlgari Tygar', 'safir', 'men', ['citrus', 'woody'], ['grapefruit'], ['ambroxan'], ['cedar', 'vetiver'], ['spring', 'summer', 'autumn'], 'day', 4, 3, 'Extrait', 690000, 0, 'square', '#E3E6EA', 'gold', null, { img: ['tygar-1'], vid: [] }]
]

// [nom, brend, jins, oilalar, top, heart, base, fasllar, vaqt, turg'unlik, tarqalish, konsentratsiya, 100ml narx, chegirma %, shakl, suyuqlik, qopqoq, belgilar]
const P = [...REAL,
  ['Sauvage Elixir', 'dior', 'men', ['spicy', 'woody'], ['cinnamon', 'cardamom', 'grapefruit'], ['lavender'], ['amber', 'patchouli', 'sandalwood'], ['autumn', 'winter'], 'evening', 5, 4, 'Parfum', 1650000, 0, 'square', '#3B4F86', 'black', 'top'],
  ['Sauvage EDP', 'dior', 'men', ['fougere', 'spicy'], ['bergamot', 'pinkpepper'], ['lavender', 'geranium'], ['ambroxan', 'vanilla'], ['spring', 'summer', 'autumn'], 'day', 4, 4, 'EDP', 1350000, 15, 'square', '#2E4A80', 'black', 'top'],
  ['Miss Dior Blooming Bouquet', 'dior', 'women', ['floral', 'fruity'], ['mandarin', 'bergamot'], ['peony', 'rose'], ['musk'], ['spring', 'summer'], 'day', 3, 2, 'EDT', 1150000, 0, 'round', '#F2C6CF', 'silver', ''],
  ['Homme Intense', 'dior', 'men', ['woody', 'floral'], ['lavender', 'pear'], ['iris'], ['vetiver', 'cedar'], ['autumn', 'winter'], 'evening', 4, 3, 'EDP', 1290000, 0, 'tall', '#8B7B74', 'black', ''],
  ['Coco Mademoiselle', 'chanel', 'women', ['oriental', 'floral'], ['mandarin', 'bergamot'], ['rose', 'jasmine'], ['patchouli', 'vanilla', 'musk'], ['autumn', 'winter', 'spring'], 'any', 4, 4, 'EDP', 1690000, 0, 'square', '#E7B78C', 'gold', 'top'],
  ['Bleu de Chanel', 'chanel', 'men', ['woody', 'citrus'], ['grapefruit', 'lemon', 'mint'], ['incense', 'pinkpepper'], ['cedar', 'sandalwood'], ['spring', 'summer', 'autumn'], 'any', 4, 4, 'EDP', 1590000, 10, 'square', '#1E2B4E', 'black', 'top'],
  ['Chance Eau Tendre', 'chanel', 'women', ['floral', 'fruity'], ['grapefruit', 'apple'], ['jasmine'], ['musk', 'cedar'], ['spring', 'summer'], 'day', 3, 2, 'EDT', 1390000, 0, 'orb', '#F6C9C4', 'silver', ''],
  ['Egoiste Platinum', 'chanel', 'men', ['fougere', 'woody'], ['lavender', 'neroli'], ['geranium', 'sage'], ['vetiver', 'cedar'], ['spring', 'autumn'], 'day', 3, 3, 'EDT', 1290000, 20, 'tall', '#B9BCC2', 'silver', 'sale'],
  ['Lost Cherry', 'tom-ford', 'unisex', ['gourmand', 'fruity'], ['cherry', 'almond'], ['rose', 'jasmine'], ['tonka', 'vanilla', 'sandalwood'], ['autumn', 'winter'], 'evening', 4, 4, 'EDP', 2900000, 0, 'square', '#8E1B2C', 'black', 'top'],
  ['Ombre Leather', 'tom-ford', 'unisex', ['leather', 'woody'], ['cardamom'], ['leather', 'jasmine'], ['amber', 'patchouli'], ['autumn', 'winter'], 'evening', 5, 4, 'EDP', 2350000, 0, 'square', '#5A3A2A', 'black', ''],
  ['Tobacco Vanille', 'tom-ford', 'unisex', ['oriental', 'spicy'], ['tobacco', 'cinnamon'], ['vanilla', 'tonka'], ['coffee', 'amber'], ['winter'], 'evening', 5, 5, 'EDP', 2950000, 0, 'square', '#9B5B2B', 'black', 'new'],
  ['Neroli Portofino', 'tom-ford', 'unisex', ['citrus', 'aquatic'], ['bergamot', 'lemon', 'mandarin'], ['neroli', 'orangeblossom'], ['amber', 'musk'], ['summer'], 'day', 3, 3, 'EDP', 2700000, 10, 'square', '#9ED3E6', 'gold', ''],
  ['Libre', 'ysl', 'women', ['floral', 'oriental'], ['lavender', 'mandarin'], ['orangeblossom', 'jasmine'], ['vanilla', 'musk'], ['autumn', 'winter', 'spring'], 'any', 4, 4, 'EDP', 1450000, 0, 'facet', '#E9D3A6', 'gold', 'top'],
  ['Y Eau de Parfum', 'ysl', 'men', ['fougere', 'woody'], ['apple', 'bergamot'], ['sage', 'geranium'], ['tonka', 'amber', 'cedar'], ['spring', 'autumn'], 'any', 4, 4, 'EDP', 1350000, 15, 'tall', '#2A3E73', 'silver', ''],
  ['Black Opium', 'ysl', 'women', ['gourmand', 'oriental'], ['pear', 'pinkpepper'], ['coffee', 'jasmine'], ['vanilla', 'patchouli', 'cedar'], ['autumn', 'winter'], 'evening', 4, 4, 'EDP', 1390000, 0, 'facet', '#2B1E2E', 'black', ''],
  ['MYSLF', 'ysl', 'men', ['floral', 'woody'], ['bergamot'], ['orangeblossom'], ['patchouli', 'amber'], ['spring', 'summer', 'autumn'], 'day', 3, 3, 'EDP', 1420000, 0, 'square', '#C9C1B6', 'black', 'new'],
  ['Acqua di Gio Profondo', 'armani', 'men', ['aquatic', 'citrus'], ['marine', 'bergamot', 'mandarin'], ['lavender', 'cardamom'], ['musk', 'patchouli', 'amber'], ['summer', 'spring'], 'day', 3, 3, 'EDP', 1190000, 10, 'round', '#3A7BB8', 'silver', ''],
  ['Si Passione', 'armani', 'women', ['fruity', 'floral'], ['blackcurrant', 'pear', 'pinkpepper'], ['rose', 'jasmine'], ['vanilla', 'cedar'], ['autumn', 'winter'], 'evening', 4, 3, 'EDP', 1250000, 0, 'square', '#B41F3A', 'black', ''],
  ['Stronger With You Intensely', 'armani', 'men', ['oriental', 'spicy'], ['pinkpepper', 'cardamom'], ['lavender', 'cinnamon'], ['vanilla', 'tonka', 'amber'], ['autumn', 'winter'], 'evening', 5, 4, 'EDP', 1190000, 25, 'round', '#6B2D24', 'black', 'sale'],
  ['Eros', 'versace', 'men', ['fougere', 'oriental'], ['mint', 'apple', 'lemon'], ['tonka', 'geranium'], ['vanilla', 'vetiver', 'cedar'], ['autumn', 'winter', 'spring'], 'evening', 4, 4, 'EDT', 990000, 20, 'tall', '#39B6A8', 'gold', 'sale'],
  ['Pour Homme', 'versace', 'men', ['fougere', 'citrus'], ['bergamot', 'neroli', 'lemon'], ['geranium', 'sage'], ['musk', 'tonka', 'amber'], ['spring', 'summer'], 'day', 3, 3, 'EDT', 790000, 0, 'tall', '#6EA6D9', 'silver', ''],
  ['Bright Crystal', 'versace', 'women', ['floral', 'fruity'], ['pinkpepper', 'mandarin'], ['peony'], ['musk', 'amber'], ['spring', 'summer'], 'day', 3, 2, 'EDT', 890000, 30, 'facet', '#F3B9C6', 'silver', 'sale'],
  ['Aventus', 'creed', 'men', ['fruity', 'woody'], ['pineapple', 'bergamot', 'blackcurrant'], ['birch', 'jasmine'], ['musk', 'amber', 'vetiver'], ['spring', 'summer', 'autumn'], 'any', 5, 4, 'EDP', 3900000, 0, 'tall', '#20242C', 'silver', 'top'],
  ['Silver Mountain Water', 'creed', 'unisex', ['aquatic', 'citrus'], ['bergamot', 'mandarin'], ['tea', 'blackcurrant'], ['musk', 'sandalwood'], ['summer', 'spring'], 'day', 3, 3, 'EDP', 3450000, 0, 'tall', '#C7D6DE', 'silver', ''],
  ['Baccarat Rouge 540', 'mfk', 'unisex', ['oriental', 'woody'], ['saffron', 'jasmine'], ['amber', 'cedar'], ['ambroxan', 'musk'], ['autumn', 'winter', 'spring'], 'any', 5, 5, 'Extrait', 4900000, 0, 'facet', '#C7352E', 'gold', 'top'],
  ['Gentle Fluidity Gold', 'mfk', 'unisex', ['oriental', 'gourmand'], ['musk'], ['vanilla', 'amber'], ['sandalwood', 'tonka'], ['autumn', 'winter'], 'evening', 4, 3, 'EDP', 3600000, 0, 'facet', '#D9B061', 'gold', 'new'],
  ['Naxos', 'xerjoff', 'unisex', ['oriental', 'gourmand'], ['lavender', 'bergamot', 'lemon'], ['honey', 'cinnamon', 'jasmine'], ['tobacco', 'tonka', 'vanilla'], ['autumn', 'winter'], 'evening', 5, 4, 'EDP', 3200000, 0, 'orb', '#C98A3A', 'gold', ''],
  ['Erba Pura', 'xerjoff', 'unisex', ['fruity', 'citrus'], ['mandarin', 'lemon', 'bergamot'], ['fig', 'pear'], ['vanilla', 'musk', 'amber'], ['spring', 'summer'], 'day', 5, 5, 'EDP', 3100000, 10, 'orb', '#E7A33C', 'gold', ''],
  ['Angels\' Share', 'kilian', 'unisex', ['gourmand', 'spicy'], ['cinnamon'], ['tonka', 'almond'], ['vanilla', 'sandalwood', 'caramel'], ['autumn', 'winter'], 'evening', 4, 4, 'EDP', 3500000, 0, 'square', '#A55A1E', 'gold', 'top'],
  ['Good Girl Gone Bad', 'kilian', 'women', ['floral'], ['plum', 'orangeblossom'], ['tuberose', 'jasmine', 'rose'], ['amber', 'cedar'], ['spring', 'summer'], 'day', 3, 3, 'EDP', 3300000, 0, 'square', '#E9A9B5', 'gold', ''],
  ['Oud for Greatness', 'initio', 'unisex', ['woody', 'oriental'], ['saffron', 'lavender'], ['oud'], ['patchouli', 'musk'], ['autumn', 'winter'], 'evening', 5, 5, 'EDP', 3700000, 0, 'tall', '#2A1A14', 'gold', ''],
  ['Side Effect', 'initio', 'unisex', ['oriental', 'gourmand'], ['tobacco', 'cinnamon'], ['vanilla'], ['amber', 'tonka'], ['winter'], 'evening', 5, 4, 'EDP', 3650000, 15, 'tall', '#5B2330', 'gold', ''],
  ['Layton', 'pdm', 'men', ['fougere', 'spicy'], ['apple', 'lavender', 'bergamot'], ['geranium', 'jasmine'], ['vanilla', 'cardamom', 'sandalwood'], ['autumn', 'winter', 'spring'], 'any', 5, 4, 'EDP', 3100000, 0, 'square', '#1F2E5A', 'gold', 'top'],
  ['Delina', 'pdm', 'women', ['floral', 'fruity'], ['pear', 'bergamot'], ['rose', 'peony'], ['vanilla', 'musk', 'cedar'], ['spring', 'autumn'], 'any', 4, 4, 'EDP', 3300000, 0, 'square', '#F0A5BC', 'gold', ''],
  ['Pegasus', 'pdm', 'men', ['oriental', 'gourmand'], ['bergamot', 'almond'], ['lavender', 'jasmine'], ['vanilla', 'sandalwood', 'amber'], ['autumn', 'winter'], 'evening', 4, 4, 'EDP', 2900000, 20, 'square', '#7E8C9A', 'gold', 'sale'],
  ['Shalimar', 'guerlain', 'women', ['oriental', 'gourmand'], ['bergamot', 'lemon'], ['iris', 'jasmine', 'rose'], ['vanilla', 'incense', 'tonka'], ['autumn', 'winter'], 'evening', 4, 4, 'EDP', 1550000, 0, 'facet', '#5F7FB8', 'gold', ''],
  ['L\'Homme Ideal', 'guerlain', 'men', ['gourmand', 'woody'], ['almond', 'bergamot'], ['leather', 'tonka'], ['vetiver', 'cedar'], ['autumn', 'winter'], 'evening', 4, 3, 'EDP', 1290000, 0, 'tall', '#6D4A2F', 'black', ''],
  ['La Vie Est Belle', 'lancome', 'women', ['gourmand', 'fruity'], ['blackcurrant', 'pear'], ['iris', 'jasmine', 'orangeblossom'], ['vanilla', 'patchouli', 'tonka'], ['autumn', 'winter'], 'any', 5, 4, 'EDP', 1350000, 10, 'facet', '#E7B3B8', 'silver', 'top'],
  ['Idole', 'lancome', 'women', ['floral'], ['bergamot', 'pear'], ['rose', 'jasmine'], ['vanilla', 'musk'], ['spring', 'summer'], 'day', 3, 3, 'EDP', 1290000, 0, 'slim', '#F1C9B7', 'gold', 'new'],
  ['Gypsy Water', 'byredo', 'unisex', ['woody', 'citrus'], ['bergamot', 'lemon', 'blackpepper'], ['incense', 'iris'], ['vanilla', 'sandalwood'], ['spring', 'summer', 'autumn'], 'day', 3, 2, 'EDP', 2700000, 0, 'slim', '#E9E3D6', 'black', ''],
  ['Mojave Ghost', 'byredo', 'unisex', ['woody', 'floral'], ['pear'], ['sandalwood', 'iris'], ['amber', 'musk', 'cedar'], ['spring', 'summer'], 'day', 3, 2, 'EDP', 2700000, 0, 'slim', '#D8D2C2', 'black', 'new'],
  ['Santal 33', 'le-labo', 'unisex', ['woody', 'leather'], ['cardamom', 'iris'], ['leather', 'cedar'], ['sandalwood', 'amber'], ['autumn', 'spring'], 'any', 4, 4, 'EDP', 3100000, 0, 'slim', '#D7C4A3', 'black', 'top'],
  ['Another 13', 'le-labo', 'unisex', ['woody'], ['pear'], ['jasmine', 'ambroxan'], ['musk', 'amber'], ['spring', 'summer', 'autumn', 'winter'], 'any', 4, 3, 'EDP', 3100000, 10, 'slim', '#ECE7DA', 'black', ''],
  ['Intense Cafe', 'montale', 'unisex', ['gourmand', 'floral'], ['coffee', 'rose'], ['amber', 'vanilla'], ['musk'], ['autumn', 'winter'], 'evening', 5, 4, 'EDP', 1450000, 0, 'round', '#6B3E2B', 'gold', ''],
  ['Arabians Tonka', 'montale', 'unisex', ['oriental', 'woody'], ['saffron', 'bergamot'], ['oud', 'rose'], ['tonka', 'amber'], ['winter'], 'evening', 5, 5, 'EDP', 1490000, 20, 'round', '#3D2016', 'gold', 'sale'],
  ['Interlude Man', 'amouage', 'men', ['oriental', 'woody'], ['bergamot', 'cardamom'], ['incense', 'amber'], ['oud', 'leather', 'patchouli'], ['autumn', 'winter'], 'evening', 5, 5, 'EDP', 3800000, 0, 'orb', '#2C4C6E', 'gold', ''],
  ['Guidance', 'amouage', 'unisex', ['floral', 'oriental'], ['pear', 'saffron'], ['rose', 'jasmine'], ['incense', 'sandalwood', 'vanilla'], ['autumn', 'winter'], 'evening', 5, 4, 'EDP', 3900000, 0, 'orb', '#D3B57A', 'gold', 'new'],
  ['Reflection Man', 'amouage', 'men', ['floral', 'woody'], ['neroli', 'pinkpepper'], ['jasmine', 'orangeblossom'], ['sandalwood', 'vetiver', 'cedar'], ['spring', 'summer'], 'day', 4, 3, 'EDP', 3600000, 10, 'orb', '#BFD0D9', 'silver', '']
]

const TAGLINES = {
  floral: [['Gullar bilan nafas oladigan nafislik', 'Изящество, которое дышит цветами'], ['Bahor bog\'ining yumshoq ovozi', 'Нежный голос весеннего сада']],
  oriental: [['Issiq, sirli va unutilmas', 'Тёплый, загадочный, незабываемый'], ['Kechki shaharning oltin izi', 'Золотой шлейф вечернего города']],
  woody: [['Tinch kuch va ishonch', 'Спокойная сила и уверенность'], ['Quruq yog\'och va toza havo', 'Сухое дерево и чистый воздух']],
  citrus: [['Yozgi tongning yorqin boshlanishi', 'Яркое начало летнего утра'], ['Tetiklik bir tomchida', 'Свежесть в одной капле']],
  fougere: [['Klassik erkaklik, zamonaviy ohangda', 'Классическая мужественность в новом звучании'], ['Toza, ishonchli, har kunga', 'Чисто, уверенно, на каждый день']],
  fruity: [['Shirali mevalar va yengil kayfiyat', 'Сочные фрукты и лёгкое настроение'], ['Quvnoq va yorqin xarakter', 'Весёлый и яркий характер']],
  aquatic: [['Dengiz shabadasi teringizda', 'Морской бриз на коже'], ['Salqin, toza, erkin', 'Прохладно, чисто, свободно']],
  gourmand: [['Shirin, ammo shirinlikdan ko\'proq', 'Сладкий, но больше чем сладость'], ['Qishki kechaning iliq quchog\'i', 'Тёплые объятия зимнего вечера']],
  leather: [['Yumshoq teri va jasur xarakter', 'Мягкая кожа и смелый характер']],
  spicy: [['Ziravorlar bilan yonayotgan iz', 'Шлейф, горящий пряностями']]
}

const GENDER = { men: ['erkaklar', 'мужчин'], women: ['ayollar', 'женщин'], unisex: ['har kim', 'всех'] }
const TIME = { day: ['kunduzi', 'днём'], evening: ['kechqurun', 'вечером'], any: ['istalgan vaqtda', 'в любое время'] }

const slugify = s => s.toLowerCase().replace(/'/g, '').replace(/ô/g, 'o').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const round = n => Math.round(n / 10000) * 10000
const list = (keys, li) => keys.map(k => NOTES[k][li])
const join2 = (arr, li) => arr.length < 2 ? arr.join('') : arr.slice(0, -1).join(', ') + (li === 0 ? ' va ' : ' и ') + arr.at(-1)

let seed = 7
const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280)

const products = P.map((r, i) => {
  const [name, brand, gender, fam, top, heart, base, seasons, time, longevity, sillage, conc, p100, disc, shape, liquid, cap, flag, media] = r
  const real = !!media
  const slug = slugify(`${brandName[brand]} ${name}`)
  const mk = ml => {
    const k = ml === 100 ? 1 : ml === 50 ? 0.62 : 0.4
    const price = round(p100 * k * (1 - disc / 100))
    const oldPrice = disc ? round(p100 * k) : null
    return { ml, price, oldPrice, stock: (i + ml) % 11 === 0 ? 0 : 3 + ((i * 7 + ml) % 9) }
  }
  const fam1 = FAMILIES[fam[0]], fam2 = FAMILIES[fam[1] || fam[0]]
  const tl = TAGLINES[fam[0]][i % TAGLINES[fam[0]].length]
  const desc = li => {
    const b = brandName[brand]
    const s = join2(seasons.map(x => SEASONS[x][li]), li)
    return li === 0
      ? `${name} — ${b} uyidan ${GENDER[gender][0]} uchun ${fam1[0].toLowerCase()}${fam[1] ? ' va ' + fam2[0].toLowerCase() : ''} hid. Ochilishida ${join2(list(top, 0), 0)} seziladi, yuragida ${join2(list(heart, 0), 0)} ochiladi, izida esa ${join2(list(base, 0), 0)} qoladi. Ayniqsa ${s} fasllarida, ${TIME[time][0]} yaxshi ochiladi.`
      : `${name} — аромат дома ${b} для ${GENDER[gender][1]}: ${fam1[1].toLowerCase()}${fam[1] ? ' и ' + fam2[1].toLowerCase() : ''}. В начале звучат ${join2(list(top, 1), 1)}, в сердце раскрываются ${join2(list(heart, 1), 1)}, в шлейфе остаются ${join2(list(base, 1), 1)}. Лучше всего раскрывается: ${s}, ${TIME[time][1]}.`
  }
  return {
    id: 1001 + i,
    slug,
    name,
    brand,
    gender,
    families: fam,
    notes: { top, heart, base },
    seasons,
    time,
    longevity,
    sillage,
    concentration: conc,
    sizes: [mk(30), mk(50), mk(100)],
    discount: disc,
    tagline: { uz: tl[0], ru: tl[1] },
    description: { uz: desc(0), ru: desc(1) },
    art: { shape, liquid, cap },
    real,
    images: real ? media.img.map(k => `/media/p/${k}`) : [],
    videos: real ? media.vid.map(k => `/media/v/${k}`) : [],
    photoFit: real ? media.fit || 'contain' : null,
    badge: flag || null,
    featured: real || i % 3 === 0 || flag === 'top',
    isNew: flag === 'new',
    rating: Math.round((4.5 + rnd() * 0.5) * 10) / 10,
    reviews: 6 + Math.floor(rnd() * 120),
    popularity: real ? 2000 - i : Math.floor(rnd() * 1000),
    createdAt: `2026-${String(1 + (i % 11)).padStart(2, '0')}-${String(1 + (i * 3) % 27).padStart(2, '0')}`
  }
})

const collections = [
  { slug: 'yangi', rule: 'new', name: { uz: 'Yangi kelganlar', ru: 'Новинки' }, text: { uz: 'Bu oy javonlarimizga qo\'shilgan atirlar', ru: 'Ароматы, появившиеся в этом месяце' }, tone: ['#1F3F78', '#0E1A33'] },
  { slug: 'top', rule: 'top', name: { uz: 'Eng ko\'p sotilganlar', ru: 'Бестселлеры' }, text: { uz: 'Mijozlarimiz qayta-qayta tanlayotganlar', ru: 'То, что выбирают снова и снова' }, tone: ['#A8844F', '#5B4222'] },
  { slug: 'sovga', rule: 'gift', name: { uz: 'Sovg\'a uchun', ru: 'В подарок' }, text: { uz: 'Xato qilib bo\'lmaydigan tanlovlar', ru: 'Беспроигрышный выбор' }, tone: ['#8E1B2C', '#3D0C14'] },
  { slug: 'yozgi', rule: 'summer', name: { uz: 'Yozgi tanlov', ru: 'Летняя подборка' }, text: { uz: 'Issiqda ham og\'irlashmaydigan hidlar', ru: 'Ароматы, которые не тяжелеют в жару' }, tone: ['#3A7BB8', '#123A63'] },
  { slug: 'kechki', rule: 'evening', name: { uz: 'Kechki atirlar', ru: 'Вечерние ароматы' }, text: { uz: 'Uchrashuv va tadbirlar uchun', ru: 'Для встреч и выходов' }, tone: ['#2B1E2E', '#120C14'] },
  { slug: 'chegirma', rule: 'sale', name: { uz: 'Chegirmalar', ru: 'Скидки' }, text: { uz: '30% gacha arzonroq', ru: 'Выгода до 30%' }, tone: ['#B23A2E', '#5E1A14'] }
]

// Banner slaydlari mijoz suratlari bilan (public/media/hero). focal — surat qaysi nuqtasi markazda turadi,
// nozzle — atir sepiladigan nuqta (surat eni/bo'yiga nisbatan), theme — matn rangi.
const banners = [
  { id: 1, title: { uz: 'Hidingizni topamiz', ru: 'Найдём ваш аромат' }, text: { uz: 'Originaldan ilhomlangan parfumlar — 30, 50 va 100 ml. Do\'konda hidlab, uyda kutib oling.', ru: 'Парфюмы, вдохновлённые оригиналами — 30, 50 и 100 мл. Попробуйте в бутике, получите дома.' }, cta: { uz: 'Katalogni ko\'rish', ru: 'Смотреть каталог' }, to: '/shop', photo: '/media/hero/aura-men', theme: 'dark', panel: ['#16120E', '#050507'], focal: [0.5, 0.42], nozzle: [0.49, 0.3], mist: '#ffffff' },
  { id: 2, title: { uz: 'AURA 19+ ayollar uchun', ru: 'AURA 19+ для женщин' }, text: { uz: 'Atirgul, yasmin va iliq vanil — kechki uchrashuvlar uchun', ru: 'Роза, жасмин и тёплая ваниль — для вечерних встреч' }, cta: { uz: 'Atirni ko\'rish', ru: 'Смотреть аромат' }, to: '/product/sefir-parfum-aura-19-for-women', photo: '/media/hero/aura-women-trio', theme: 'light', panel: ['#F8E9E1', '#EBC9B9'], focal: [0.55, 0.42], nozzle: null, mist: '#F4D3C8' },
  { id: 3, title: { uz: '30% gacha chegirma', ru: 'Скидки до 30%' }, text: { uz: 'Tanlangan atirlar — faqat shu hafta', ru: 'Избранные ароматы — только на этой неделе' }, cta: { uz: 'Chegirmalarni ko\'rish', ru: 'Смотреть скидки' }, to: '/collections/chegirma', photo: '/media/hero/aura-women', theme: 'light', panel: ['#F6E6DB', '#E7C2AB'], focal: [0.6, 0.5], nozzle: null, mist: '#F4D3C8' }
]


const testimonials = [
  ['madina.r', 'instagram', '2026-10-28', 'Baccarat Rouge oldim, hidi do\'kondagidek — originalga juda yaqin. Kuryer 3 soatda olib keldi, rahmat!', 'Взяла Baccarat Rouge — аромат как в бутике. Курьер привёз за 3 часа, спасибо!'],
  ['jasur_t', 'telegram', '2026-10-21', 'Konsultant 10 daqiqada menga mos 3 ta atir topib berdi. Layton\'ni tanladim, ish joyida hamma so\'rayapti.', 'Консультант за 10 минут подобрал 3 аромата. Выбрал Layton — на работе все спрашивают.'],
  ['nilufar.k', 'instagram', '2026-10-14', 'Onamga sovg\'a qildim, qutisi juda chiroyli ekan. 50 ml hajm sovg\'a uchun ideal.', 'Подарила маме, упаковка очень красивая. 50 мл — идеально для подарка.'],
  ['sardor', 'telegram', '2026-10-09', 'Samarqandga 2 kunda keldi, hammasi butun. Narxi ham boshqa joylardan arzonroq chiqdi.', 'В Самарканд доставили за 2 дня, всё целое. И цена ниже, чем у других.'],
  ['aziza_m', 'instagram', '2026-09-30', 'Testni o\'tib ko\'rdim — tavsiya qilingan Delina rostdan menga mos keldi!', 'Прошла тест — рекомендованная Delina действительно мне подошла!'],
  ['bekzod.a', 'telegram', '2026-09-22', 'Aventus 30 ml oldim, avval sinab ko\'rish uchun. Endi 100 ml olaman.', 'Взял Aventus 30 мл на пробу. Теперь возьму 100 мл.']
].map(([user, source, date, uz, ru], i) => ({ id: i + 1, user, source, date, text: { uz, ru }, product: ['maison-francis-kurkdjian-baccarat-rouge-540', 'parfums-de-marly-layton', 'guerlain-shalimar', 'sefir-parfum-aura-19-for-women', 'parfums-de-marly-delina', 'creed-aventus'][i] }))

const faq = [
  ['Atirlaringiz originalmi?', 'Ваши ароматы оригинальные?', 'Bizning parfumlarimiz 100% original atirlardan ilhomlangan: hidi va xarakteri originalga yaqin, narxi esa ancha hamyonbop. Do\'konda hidlab ko\'rishingiz mumkin.', 'Да. Все ароматы поступают от официальных дистрибьюторов, у каждого флакона есть номер партии. В бутике можно попробовать.'],
  ['Yetkazib berish qanday?', 'Как работает доставка?', 'Toshkent bo\'ylab kuryer bir kunda olib boradi, 500 000 so\'mdan yuqori buyurtmada bepul. Viloyatlarga 1–3 kunda pochta orqali yuboramiz.', 'По Ташкенту курьер доставит за день, бесплатно от 500 000 сум. В регионы отправляем почтой за 1–3 дня.'],
  ['To\'lovni qanday qilaman?', 'Как оплатить?', 'Naqd pul yoki bank kartasi (Uzcard, Humo) orqali — kuryerga yoki filialda. Online to\'lov tez orada qo\'shiladi.', 'Наличными или картой Uzcard / Humo — курьеру или в бутике. Онлайн-оплата скоро появится.'],
  ['Sotib olishdan oldin hidlab ko\'rsam bo\'ladimi?', 'Можно ли попробовать перед покупкой?', 'Albatta. Filiallarimizda barcha atirlarning testerlari bor, maslahatchi tanlashga yordam beradi.', 'Конечно. В бутиках есть тестеры всех ароматов, консультант поможет с выбором.'],
  ['Qaysi hajmlar bor?', 'Какие есть объёмы?', 'Har bir atir 30, 50 va 100 ml hajmda. 30 ml sinab ko\'rish yoki safar uchun qulay.', 'Каждый аромат — 30, 50 и 100 мл. 30 мл удобно для знакомства и поездок.'],
  ['Atirni qaytarsa bo\'ladimi?', 'Можно ли вернуть аромат?', 'Ha. Ochilmagan va plyonkasi butun atirni qaytarish yoki boshqasiga almashtirish imkoniyati mavjud.', 'Да. Невскрытый аромат в целой плёнке можно вернуть или обменять на другой.']
].map(([qu, qr, au, ar], i) => ({ id: i + 1, q: { uz: qu, ru: qr }, a: { uz: au, ru: ar } }))

const branches = [
  { id: 1, slug: 'markaz', name: { uz: 'Sefir Parfum Markaz', ru: 'Sefir Parfum Центр' }, city: { uz: 'Toshkent', ru: 'Ташкент' }, address: { uz: 'Amir Temur ko\'chasi, 15', ru: 'ул. Амира Темура, 15' }, landmark: { uz: 'Mo\'ljal: Amir Temur xiyoboni', ru: 'Ориентир: сквер Амира Темура' }, hours: '10:00 — 22:00', phone: '+998 90 000 00 01', lat: 41.3111, lng: 69.2797 },
  { id: 2, slug: 'chilonzor', name: { uz: 'Sefir Parfum Chilonzor', ru: 'Sefir Parfum Чиланзар' }, city: { uz: 'Toshkent', ru: 'Ташкент' }, address: { uz: 'Bunyodkor shoh ko\'chasi, 42', ru: 'пр. Бунёдкор, 42' }, landmark: { uz: 'Mo\'ljal: Chilonzor metrosi', ru: 'Ориентир: метро Чиланзар' }, hours: '10:00 — 22:00', phone: '+998 90 000 00 02', lat: 41.2756, lng: 69.2034 },
  { id: 3, slug: 'samarqand', name: { uz: 'Sefir Parfum Samarqand', ru: 'Sefir Parfum Самарканд' }, city: { uz: 'Samarqand', ru: 'Самарканд' }, address: { uz: 'Universitet xiyoboni, 8', ru: 'Университетский бульвар, 8' }, landmark: { uz: 'Mo\'ljal: Registon maydoni yaqinida', ru: 'Ориентир: рядом с Регистаном' }, hours: '10:00 — 21:00', phone: '+998 90 000 00 03', lat: 39.6542, lng: 66.9597 }
]

const settings = {
  brand: 'Sefir Parfum',
  domain: 'sefir.uz',
  phone1: '+998 90 000 00 01',
  phone2: '+998 90 000 00 02',
  hours: '10:00 — 22:00',
  telegram: 'https://t.me/safirparfum',
  instagram: 'https://instagram.com/safirparfum',
  youtube: 'https://youtube.com/@safirparfum',
  tiktok: 'https://tiktok.com/@safirparfum',
  facebook: 'https://facebook.com/safirparfum',
  delivery: { tashkent: 30000, regions: 45000, freeFrom: 500000 },
  promo: [
    { code: 'SEFIR10', type: 'percent', value: 10, min: 0 },
    { code: 'YANGI50', type: 'fixed', value: 50000, min: 500000 }
  ],
  demoOtp: '1234'
}

out('products.json', products)
out('brands.json', BRANDS)
out('notes.json', Object.fromEntries(Object.entries(NOTES).map(([k, [uz, ru]]) => [k, { uz, ru }])))
out('families.json', Object.fromEntries(Object.entries(FAMILIES).map(([k, [uz, ru]]) => [k, { uz, ru }])))
out('seasons.json', Object.fromEntries(Object.entries(SEASONS).map(([k, [uz, ru]]) => [k, { uz, ru }])))
out('collections.json', collections)
out('banners.json', banners)
out('testimonials.json', testimonials)
out('faq.json', faq)
out('branches.json', branches)
out('settings.json', settings)
console.log(`OK: ${products.length} mahsulot, ${BRANDS.length} brend`)
