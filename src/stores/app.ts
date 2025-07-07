import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore("app", () => {
  const userInfo = ref<User>();
  const token = ref<Token>();
  const setting = ref<Setting>();

  const signin = computed<boolean>((e) =>
    Boolean(
      userInfo.value && token.value &&
        Date.now() < parseInt(`${token.value.exp}0000`),
    )
  );
  const isSelf = (id: string | number) => {
    return signin.value && `${id}` === `${userInfo.value?.id}`;
  };
  function loginOut() {
    userInfo.value = undefined;
    token.value = undefined;
  }
  return {
    token,
    userInfo,
    setting,
    signin,
    loginOut,
    isSelf,
  };
}, {
  persist: true,
});
