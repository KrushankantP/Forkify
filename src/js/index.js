import Search from "./models/Search";
import {elements, renderLoader, clearLoader} from "./views/base";
import * as searchView  from "./views/searchView";
/** Global state of the app
 * - Search Object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 * */
const state = {};

const controlSearch =async ()=>{
    const query = searchView.getInput()

    if(query){
        //2) new Search object and add to state
        state.search = new Search(query);

        //3 Prepare UI of results
        searchView.clearInput(); // clear search input text.
        searchView.clearResults(); // clear previous result before displaying next search result
        renderLoader(elements.searchRes); //spinner while loading the data

        //4) Search for recipes

        await state.search.getResults();

        //5) Render results on UI
        clearLoader() // remove spinner once the data is loaded.
        searchView.renderResult(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e=>{
    e.preventDefault();
    controlSearch();
})
