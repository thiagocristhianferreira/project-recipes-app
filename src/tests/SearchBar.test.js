import React from 'react';
import { screen, wait } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../renderWithRouter';
import App from '../App';

const SEARCH_INPUT = 'search-input';
const EXEC_BTN = 'exec-search-btn';
const NAME_RADIO = 'name-search-radio';
const INGREDIENT_RADIO = 'ingredient-search-radio';
const FIRST_LETTER_RADIO = 'first-letter-search-radio';
const RECIPE_CARD = '0-recipe-card';
const ALERT_LETRA = 'Sua busca deve conter somente 1 (um) caracter';

const abrirBusca = () => {
  userEvent.click(screen.getByTestId('search-top-btn'));
};

const buscar = (texto, radio) => {
  abrirBusca();
  userEvent.type(screen.getByTestId(SEARCH_INPUT), texto);
  userEvent.click(screen.getByTestId(radio));
  userEvent.click(screen.getByTestId(EXEC_BTN));
};

const mockAlert = () => jest.spyOn(window, 'alert').mockImplementation(() => {});

describe('Barra de busca na tela de Comidas', () => {
  it('redireciona para os detalhes quando o nome retorna 1 receita', async () => {
    const { history } = renderWithRouter(<App />, ['/comidas']);
    buscar('Arrabiata', NAME_RADIO);

    await wait(() => {
      expect(history.location.pathname).toBe('/comidas/52771');
    });
  });

  it('mostra cards ao buscar por ingrediente com vários resultados', async () => {
    renderWithRouter(<App />, ['/comidas']);
    buscar('Chicken', INGREDIENT_RADIO);

    await wait(() => {
      expect(screen.getByTestId(RECIPE_CARD)).toBeInTheDocument();
    });
  });

  it('exibe alert ao buscar por primeira letra com mais de um caractere', async () => {
    const alertMock = mockAlert();
    renderWithRouter(<App />, ['/comidas']);
    buscar('ab', FIRST_LETTER_RADIO);

    await wait(() => {
      expect(alertMock).toHaveBeenCalledWith(ALERT_LETRA);
    });
    alertMock.mockRestore();
  });

  it('exibe alert quando nenhuma receita é encontrada', async () => {
    const alertMock = mockAlert();
    renderWithRouter(<App />, ['/comidas']);
    buscar('xablau', NAME_RADIO);

    await wait(() => {
      expect(alertMock).toHaveBeenCalled();
    });
    alertMock.mockRestore();
  });
});

describe('Barra de busca na tela de Bebidas - resultados', () => {
  it('redireciona para os detalhes quando o nome retorna 1 bebida', async () => {
    const { history } = renderWithRouter(<App />, ['/bebidas']);
    buscar('Aquamarine', NAME_RADIO);

    await wait(() => {
      expect(history.location.pathname).toBe('/bebidas/178319');
    });
  });

  it('busca bebidas por ingrediente sem quebrar a tela', async () => {
    renderWithRouter(<App />, ['/bebidas']);
    buscar('Light rum', INGREDIENT_RADIO);

    await wait(() => {
      expect(screen.getByTestId(RECIPE_CARD)).toBeInTheDocument();
    });
  });

  it('busca bebidas por primeira letra com um caractere', async () => {
    renderWithRouter(<App />, ['/bebidas']);
    buscar('a', FIRST_LETTER_RADIO);

    await wait(() => {
      expect(screen.getByTestId(SEARCH_INPUT)).toBeInTheDocument();
    });
  });
});

describe('Barra de busca na tela de Bebidas - alertas', () => {
  it('exibe alert na busca de bebidas por letra com mais de um caractere', async () => {
    const alertMock = mockAlert();
    renderWithRouter(<App />, ['/bebidas']);
    buscar('ab', FIRST_LETTER_RADIO);

    await wait(() => {
      expect(alertMock).toHaveBeenCalledWith(ALERT_LETRA);
    });
    alertMock.mockRestore();
  });

  it('exibe alert quando nenhuma bebida é encontrada', async () => {
    const alertMock = mockAlert();
    renderWithRouter(<App />, ['/bebidas']);
    buscar('xablau', NAME_RADIO);

    await wait(() => {
      expect(alertMock).toHaveBeenCalled();
    });
    alertMock.mockRestore();
  });
});
