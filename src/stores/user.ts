import { defineStore } from "pinia";
import { ref } from "vue";

export const useUsers = defineStore("userStore", () => {
    const users = ref<Map<User["id"], User>>(new Map());
    function getUser(id: User["id"]) {
        return users.value.get(id);
    }
    function setUsers(list: User[]) {
        list.forEach((user) => {
            users.value.set(user.id, user);
        });
    }
    return {
        getUser,
        setUsers,
        users,
    };
});
