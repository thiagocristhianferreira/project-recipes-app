import {
  getIngredientes,
  removerIngredienteDoArray,
  checkIngrediente,
  checkFavoritos,
  copyLink,
  adicionarFavorito,
  salvarReceitaFeita,
  checkReceitaCompleta,
} from '../services/services';

const oneMeal = require('../../cypress/mocks/oneMeal');

const ID_COMIDA = '52771';
const ID_BEBIDA = '178319';
const FAVORITOS = 'favoriteRecipes';
const DONE = 'doneRecipes';
const IN_PROGRESS = 'inProgressRecipes';
const drink = {
  strDrink: 'X', strDrinkThumb: 'img', strCategory: 'Cocktail', strAlcoholic: 'Alcoholic',
};

describe('services - getIngredientes e removerIngredienteDoArray', () => {
  it('getIngredientes retorna os ingredientes com suas medidas', () => {
    const lista = getIngredientes(oneMeal.meals[0]);
    expect(lista.length).toBeGreaterThan(0);
    expect(lista[0]).toHaveProperty('ingredient');
    expect(lista[0]).toHaveProperty('measure');
  });

  it('removerIngredienteDoArray remove o item informado', () => {
    expect(removerIngredienteDoArray('b', ['a', 'b', 'c'])).toEqual(['a', 'c']);
  });
});

describe('services - checkIngrediente', () => {
  it('cria a estrutura no localStorage quando não existe', () => {
    checkIngrediente('garlic', 'meals', ID_COMIDA);
    const salvo = JSON.parse(localStorage.getItem(IN_PROGRESS));
    expect(salvo.meals[ID_COMIDA]).toContain('garlic');
  });

  it('adiciona e depois remove o ingrediente ao marcar duas vezes', () => {
    checkIngrediente('garlic', 'meals', ID_COMIDA);
    checkIngrediente('onion', 'meals', ID_COMIDA);
    expect(JSON.parse(localStorage.getItem(IN_PROGRESS)).meals[ID_COMIDA])
      .toEqual(['garlic', 'onion']);

    checkIngrediente('garlic', 'meals', ID_COMIDA);
    expect(JSON.parse(localStorage.getItem(IN_PROGRESS)).meals[ID_COMIDA])
      .toEqual(['onion']);
  });

  it('adiciona ingrediente quando a receita não está na estrutura existente', () => {
    localStorage.setItem(IN_PROGRESS, JSON.stringify({ meals: {}, cocktails: {} }));
    checkIngrediente('garlic', 'meals', ID_COMIDA);
    expect(JSON.parse(localStorage.getItem(IN_PROGRESS)).meals[ID_COMIDA])
      .toEqual(['garlic']);
  });
});

describe('services - checkIngrediente remove de doneRecipes', () => {
  it('remove a comida de doneRecipes ao marcar um ingrediente', () => {
    localStorage.setItem(DONE, JSON.stringify([{ id: ID_COMIDA, type: 'comida' }]));
    checkIngrediente('garlic', 'meals', ID_COMIDA);
    expect(JSON.parse(localStorage.getItem(DONE))).toEqual([]);
  });

  it('remove a bebida de doneRecipes ao marcar um ingrediente', () => {
    localStorage.setItem(DONE, JSON.stringify([{ id: ID_BEBIDA, type: 'bebida' }]));
    checkIngrediente('rum', 'cocktails', ID_BEBIDA);
    expect(JSON.parse(localStorage.getItem(DONE))).toEqual([]);
  });
});

describe('services - favoritos', () => {
  it('checkFavoritos marca como favorito quando a receita está salva', () => {
    localStorage.setItem(FAVORITOS, JSON.stringify([{ id: ID_COMIDA }]));
    const setIsFavorito = jest.fn();
    checkFavoritos(ID_COMIDA, setIsFavorito);
    expect(setIsFavorito).toHaveBeenCalledWith(true);
  });

  it('adicionarFavorito adiciona uma comida quando não há favoritos', () => {
    const setIsFavorito = jest.fn();
    adicionarFavorito(ID_COMIDA, 'meals', oneMeal.meals[0], setIsFavorito);
    const favoritos = JSON.parse(localStorage.getItem(FAVORITOS));
    expect(favoritos[0].id).toBe(ID_COMIDA);
    expect(setIsFavorito).toHaveBeenCalledWith(true);
  });

  it('adicionarFavorito remove ao favoritar uma receita já favoritada', () => {
    const setIsFavorito = jest.fn();
    adicionarFavorito(ID_COMIDA, 'meals', oneMeal.meals[0], setIsFavorito);
    adicionarFavorito(ID_COMIDA, 'meals', oneMeal.meals[0], setIsFavorito);
    expect(JSON.parse(localStorage.getItem(FAVORITOS))).toEqual([]);
    expect(setIsFavorito).toHaveBeenLastCalledWith(false);
  });

  it('adicionarFavorito adiciona uma segunda receita à lista existente', () => {
    const setIsFavorito = jest.fn();
    adicionarFavorito(ID_COMIDA, 'meals', oneMeal.meals[0], setIsFavorito);
    adicionarFavorito('99999', 'cocktails', drink, setIsFavorito);
    expect(JSON.parse(localStorage.getItem(FAVORITOS))).toHaveLength(2);
  });
});

describe('services - salvarReceitaFeita', () => {
  it('salva a comida com o mês correto (getMonth + 1) e tags', () => {
    salvarReceitaFeita(ID_COMIDA, 'meals', oneMeal.meals[0]);
    const done = JSON.parse(localStorage.getItem(DONE));
    const mes = String(new Date().getMonth() + 1).padStart(2, '0');
    expect(done[0].doneDate.split('/')[1]).toBe(mes);
    expect(done[0].tags).toEqual(['Pasta', 'Curry']);
  });

  it('adiciona à lista quando já existem outras receitas', () => {
    localStorage.setItem(DONE, JSON.stringify([{ id: 'outra' }]));
    salvarReceitaFeita(ID_COMIDA, 'meals', oneMeal.meals[0]);
    expect(JSON.parse(localStorage.getItem(DONE))).toHaveLength(2);
  });

  it('salva uma bebida sem tags (alcoholicOrNot e tags vazio)', () => {
    salvarReceitaFeita(ID_BEBIDA, 'cocktails', { ...drink, strTags: null });
    const done = JSON.parse(localStorage.getItem(DONE));
    expect(done[0].type).toBe('bebida');
    expect(done[0].area).toBe('');
    expect(done[0].tags).toEqual([]);
  });

  it('não duplica receita já existente', () => {
    salvarReceitaFeita(ID_COMIDA, 'meals', oneMeal.meals[0]);
    salvarReceitaFeita(ID_COMIDA, 'meals', oneMeal.meals[0]);
    expect(JSON.parse(localStorage.getItem(DONE))).toHaveLength(1);
  });
});

describe('services - checkReceitaCompleta e copyLink', () => {
  it('checkReceitaCompleta esconde o botão quando a receita já foi feita', () => {
    localStorage.setItem(DONE, JSON.stringify([{ id: ID_COMIDA }]));
    const setExibir = jest.fn();
    checkReceitaCompleta(ID_COMIDA, setExibir);
    expect(setExibir).toHaveBeenCalledWith('hidden');
  });

  it('copyLink remove o /in-progress e dispara a mensagem', () => {
    jest.useFakeTimers();
    const exibirMensagem = jest.fn();
    copyLink('http://localhost:3000/comidas/52771/in-progress', exibirMensagem);
    expect(exibirMensagem).toHaveBeenCalledWith('');
    jest.runOnlyPendingTimers();
    expect(exibirMensagem).toHaveBeenCalledWith('hidden');
    jest.useRealTimers();
  });
});
