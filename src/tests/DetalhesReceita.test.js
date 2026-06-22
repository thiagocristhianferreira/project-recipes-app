import React from 'react';
import { screen, wait } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../renderWithRouter';
import App from '../App';

const RECIPE_TITLE = 'recipe-title';
const START_BTN = 'start-recipe-btn';
const FAVORITE_BTN = 'favorite-btn';
const SHARE_BTN = 'share-btn';
const URL_COMIDA = '/comidas/52771';

describe('Tela de detalhes de uma comida', () => {
  it('mostra os dados, recomendações e o botão "Iniciar Receita"', async () => {
    renderWithRouter(<App />, [URL_COMIDA]);

    const titulo = await screen.findByTestId(RECIPE_TITLE);
    expect(titulo).toHaveTextContent('Spicy Arrabiata Penne');
    expect(screen.getByTestId('instructions')).toBeInTheDocument();
    expect(screen.getByTestId('0-ingredient-name-and-measure')).toBeInTheDocument();
    expect(screen.getByTestId('video')).toBeInTheDocument();
    expect(screen.getByTestId('0-recomendation-card')).toBeInTheDocument();
    expect(screen.getByTestId(START_BTN)).toHaveTextContent('Iniciar Receita');
  });

  it('favorita e compartilha a receita', async () => {
    renderWithRouter(<App />, [URL_COMIDA]);
    await screen.findByTestId(RECIPE_TITLE);

    userEvent.click(screen.getByTestId(FAVORITE_BTN));
    const favoritos = JSON.parse(localStorage.getItem('favoriteRecipes'));
    expect(favoritos[0].id).toBe('52771');

    userEvent.click(screen.getByTestId(SHARE_BTN));
    expect(screen.getByText('Link copiado!')).toBeInTheDocument();
  });

  it('ao clicar em "Iniciar Receita" vai para a tela em progresso', async () => {
    const { history } = renderWithRouter(<App />, [URL_COMIDA]);
    const btn = await screen.findByTestId(START_BTN);
    userEvent.click(btn);
    expect(history.location.pathname).toBe('/comidas/52771/in-progress');
  });

  it('mostra "Continuar Receita" quando a receita está em progresso', async () => {
    localStorage.setItem('inProgressRecipes', JSON.stringify({
      meals: { 52771: ['penne rigate'] },
      cocktails: {},
    }));
    renderWithRouter(<App />, [URL_COMIDA]);
    const btn = await screen.findByTestId(START_BTN);
    await wait(() => {
      expect(btn).toHaveTextContent('Continuar Receita');
    });
  });

  it('esconde o botão quando a receita já foi feita', async () => {
    localStorage.setItem('doneRecipes', JSON.stringify([{ id: '52771' }]));
    renderWithRouter(<App />, [URL_COMIDA]);
    const btn = await screen.findByTestId(START_BTN);
    await wait(() => {
      expect(btn).toHaveAttribute('hidden');
    });
  });
});

describe('Tela de detalhes de uma bebida', () => {
  it('mostra os dados e inicia a receita da bebida', async () => {
    const { history } = renderWithRouter(<App />, ['/bebidas/178319']);

    const titulo = await screen.findByTestId(RECIPE_TITLE);
    expect(titulo).toHaveTextContent('Aquamarine');
    expect(screen.queryByTestId('video')).not.toBeInTheDocument();

    userEvent.click(screen.getByTestId(START_BTN));
    expect(history.location.pathname).toBe('/bebidas/178319/in-progress');
  });
});
