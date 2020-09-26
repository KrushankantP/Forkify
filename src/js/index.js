import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import {elements, renderLoader, clearLoader} from "./views/base";
import * as searchView  from "./views/searchView";
import * as recipeView  from "./views/recipeView";
import * as listView  from "./views/listView";


/** Global state of the app
 * - Search Object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 * */
let state = {};
window.state = state;
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
            recipeView.clearRecipe()
            renderLoader(elements.recipe);

            //Highlight selected search items
            if(state.search) searchView.highlightSelected(id);

            // Create new recipe object
            state.recipe = new Recipe(id);

            // for Testing
            // window.r = state.recipe;


        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
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

/**
 * LIST CONTROLLER
 * */
const controlList = () => {
    //Create a new list IF there in none yet
    if(!state.list) state.list = new List();

    //Add each ingredient to the list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

//Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //Handle the delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {

        //Delete from state
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);

        //Handle the count update
    } else if(e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
})

/**
 * LIKE CONTROLLER
 * */
const controlLike =()=> {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    // user has NOT yet liked current recipe
    if (!state.likes.isLike(currentID)){
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        //Toggle the like button

        //Add like to UI list
        console.log(state.likes);

        //User HAS liked current recipe

    }else{
        //Remove like from the state
        state.likes.deleteLike(currentID);

        //Toggle the like button

        //Remove like from UI list
        console.log(state.likes);
    }
}


//Handling recipe button clicks
elements.recipe.addEventListener('click', e=>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')){

        //Decrease button is clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe)
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')){

        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        //Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')){
        //Like controller
        controlLike();
    }
})

window.l = new List();
