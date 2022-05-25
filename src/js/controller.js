import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if(module.hot){
//   module.hot.accept();
// }

const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    //1) Loading recipe
    await model.loadRecipe(id);

    //2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResult = async function() {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResult(query);
    resultsView.render(model.getSearchResultsPage(1));

    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function(goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));

  paginationView.render(model.state.search);
};

const controlServings = function(newServings) {
  model.updateServings(newServings);

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function() {
  // 1)Add/Delete bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
};

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
};

init();