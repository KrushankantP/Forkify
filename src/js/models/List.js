import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items =[];
    }

    addItem(count, unit, ingredient){
        const item ={
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item); // this will push the newly created object(item) push into the Array called "items";
        return item; // good practice to return newly created object to return.
    }
    deleteItem(id){
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1);
    }

    updateCount(id, newCount){
        this.items.find(el => el.id === id ).count = newCount;
    }

}
