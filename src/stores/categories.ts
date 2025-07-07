import { defineStore } from "pinia";
import { ref } from "vue";

export const useCategories = defineStore("categorieStore", () => {
    const categories = ref<Map<Categorie["id"], Categorie>>(new Map());
    function getCategorie(id: Categorie["id"]) {
        return categories.value.get(id);
    }
    function setCategories(list: Categorie[]) {
        list.forEach((category) => {
            categories.value.set(category.id, category);
        });
    }
    return {
        getCategorie,
        setCategories,
        categories,
    };
});
