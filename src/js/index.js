import Search from "./models/Search";
/** Global state of the app
 * - Search Object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 * */
const state = {};

const controlSearch =async ()=>{
    const query ='pizza' //TODO

    if(query){
        //2) new Search object and add to state
        state.search = new Search(query);

        //3 Prepare UI of results

        //4) Search for recipes

        await state.search.getResults();

        //5) Render results on UI
        console.log(state.search.result);
    }
}

document.querySelector('.search').addEventListener('submit', e=>{
    e.preventDefault();
    controlSearch();
})
