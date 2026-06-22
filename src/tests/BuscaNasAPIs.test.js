import {
  getComidasRandom,
  getComidasByName,
  getBebidasRandom,
  getComidasByIngredientes,
  getComidasByPrimeiraLetra,
  getBebidasByingredientes,
  getBebidasByName,
  getBebidasByPrimeiraLetra,
  getAllComida,
  getAllBebida,
  getComidaCategory,
  getBebidaCategory,
  getComidaByCategory,
  getBebidaByCategory,
  getIngredientsFoodList,
  getIngredientsDrinkList,
  getReceitaBebidasDetalhesPorId,
  getReceitaComidasDetalhesPorId,
  getAreaFoodList,
  getComidaByArea,
  getRecomendacoesReceitasBebidas,
  getRecomendacoesReceitasComidas,
} from '../services/BuscaNasAPIs';

const ID_COMIDA = '52771';
const ID_BEBIDA = '178319';

describe('BuscaNasAPIs - buscas de comidas', () => {
  it('busca por nome, ingrediente, primeira letra e aleatória', async () => {
    expect((await getComidasByName('Arrabiata')).meals[0].idMeal).toBe(ID_COMIDA);
    expect((await getComidasByIngredientes('Chicken')).meals).toBeDefined();
    expect((await getComidasByPrimeiraLetra('a')).meals).toBeDefined();
    expect((await getComidasRandom()).meals[0].idMeal).toBe(ID_COMIDA);
  });

  it('busca todas, categorias, por categoria e ingredientes', async () => {
    expect((await getAllComida()).meals).toBeDefined();
    expect((await getComidaCategory()).meals).toBeDefined();
    expect((await getComidaByCategory('Beef')).meals).toBeDefined();
    expect((await getIngredientsFoodList()).meals).toBeDefined();
  });

  it('busca detalhes, áreas, por área e recomendações', async () => {
    expect((await getReceitaComidasDetalhesPorId(ID_COMIDA))[0].idMeal).toBe(ID_COMIDA);
    expect((await getAreaFoodList()).meals).toBeDefined();
    expect((await getComidaByArea('Japanese')).meals).toBeDefined();
    expect(await getRecomendacoesReceitasComidas()).toBeDefined();
  });
});

describe('BuscaNasAPIs - buscas de bebidas', () => {
  it('busca por nome, ingrediente, primeira letra e aleatória', async () => {
    expect((await getBebidasByName('Aquamarine')).drinks[0].idDrink).toBe(ID_BEBIDA);
    expect((await getBebidasByingredientes('Light rum')).drinks).toBeDefined();
    expect(await getBebidasByPrimeiraLetra('a')).toBeDefined();
    expect((await getBebidasRandom()).drinks[0].idDrink).toBe(ID_BEBIDA);
  });

  it('busca todas, categorias, por categoria e ingredientes', async () => {
    expect((await getAllBebida()).drinks).toBeDefined();
    expect((await getBebidaCategory()).drinks).toBeDefined();
    expect((await getBebidaByCategory('Cocktail')).drinks).toBeDefined();
    expect((await getIngredientsDrinkList()).drinks).toBeDefined();
  });

  it('busca detalhes por id e recomendações', async () => {
    expect((await getReceitaBebidasDetalhesPorId(ID_BEBIDA))[0].idDrink).toBe(ID_BEBIDA);
    expect(await getRecomendacoesReceitasBebidas()).toBeDefined();
  });
});

describe('BuscaNasAPIs - tratamento de erro (catch)', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.reject(new Error('falha de rede')));
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('buscas com fallback retornam objeto com null em caso de erro', async () => {
    expect(await getComidasByName('x')).toEqual({ meals: null });
    expect(await getComidasByIngredientes('x')).toEqual({ meals: null });
    expect(await getComidasByPrimeiraLetra('x')).toEqual({ meals: null });
    expect(await getBebidasByName('x')).toEqual({ drinks: null });
    expect(await getBebidasByingredientes('x')).toEqual({ drinks: null });
    expect(await getBebidasByPrimeiraLetra('x')).toEqual({ drinks: null });
  });

  it('demais buscas não lançam erro quando o fetch falha', async () => {
    await expect(getComidasRandom()).resolves.toBeUndefined();
    await expect(getBebidasRandom()).resolves.toBeUndefined();
    await expect(getAllComida()).resolves.toBeUndefined();
    await expect(getAllBebida()).resolves.toBeUndefined();
    await expect(getComidaCategory()).resolves.toBeUndefined();
    await expect(getBebidaCategory()).resolves.toBeUndefined();
    await expect(getComidaByCategory('x')).resolves.toBeUndefined();
    await expect(getBebidaByCategory('x')).resolves.toBeUndefined();
    await expect(getIngredientsFoodList()).resolves.toBeUndefined();
    await expect(getIngredientsDrinkList()).resolves.toBeUndefined();
    await expect(getAreaFoodList()).resolves.toBeUndefined();
    await expect(getComidaByArea('x')).resolves.toBeUndefined();
  });
});
