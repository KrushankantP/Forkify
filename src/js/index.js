import Search from "./models/Search";
import Recipe from "./models/Recipe";
import {elements, renderLoader, clearLoader} from "./views/base";
import * as searchView  from "./views/searchView";
/** Global state of the app
 * - Search Object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 * */
const state = {};

/**
 * SEARCH CONTROLLER
 * */

const controlSearch =async ()=>{

    //1) Get Query from view
    const query = searchView.getInput()
    //for Testing
    // const query = 'pizza';

    if(query){
        //2) new Search object and add to state
        state.search = new Search(query);


        //3 Prepare UI of results
        searchView.clearInput(); // clear search input text.
        searchView.clearResults(); // clear previous result before displaying next search result
        renderLoader(elements.searchRes); //spinner while loading the data
        //4) Search for recipes
        try{
            await state.search.getResults();

            //5) Render results on UI
            clearLoader() // remove spinner once the data is loaded.
            searchView.renderResult(state.search.result);

        } catch (error) {
            alert('Something wrong with the search...');
            clearLoader();
        }


    }
}

elements.searchForm.addEventListener('submit', e=>{
    e.preventDefault();
    controlSearch();
})
// for Testing
// window.addEventListener('load', e=>{
//     e.preventDefault();
//     controlSearch();
// })

elements.searchResPages.addEventListener('click', e =>{
    const btn = e.target.closest('.btn-inline')
    if(btn){
        const goToPage =parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderResult(state.search.result, goToPage);
    }
})


/**
 * RECIPE CONTROLLER
 * */
const controlRecipe = async ()=>{
    //Get ID from Url
    const id = window.location.hash.replace('#','');
    console.log(id);

        if(id){
            // Prepare UI for changes

            // Create new recipe object
            state.recipe = new Recipe(id);

            // for Testing
            // window.r = state.recipe;


        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();
            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            // Render recipe
            console.log(state.recipe);
        }catch (error) {
            alert('Error processing recipe!');
        }
    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

//above two line of code into one line of code.
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
