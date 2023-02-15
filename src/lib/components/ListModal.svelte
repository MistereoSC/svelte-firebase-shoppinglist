<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  onMount(() => {
    document.getElementById("inputField").focus();
  });

  function clickOutsideOrCancel() {
    dispatch("close");
  }
  function okClick() {
    dispatch("ok", input);
  }

  let input = "";
  let inputIsValid = false;
  $: inputIsValid = input.length < 3 || input.length > 20 ? false : true;

  export let title = "Modal";
  export let inputPlaceholder = " . . . ";
</script>

<div
  class="modal"
  on:click|self={clickOutsideOrCancel}
  on:keydown={(e) => {
    if (e.key === "Escape") clickOutsideOrCancel();
    else if (e.key === "Enter") if (inputIsValid) okClick();
  }}
>
  <div class="dialog">
    <h1>{title}</h1>
    <input
      id="inputField"
      type="text"
      bind:value={input}
      placeholder={inputPlaceholder}
      autocomplete="off"
      class:invalid={!inputIsValid}
    />
    <div class="button-container">
      <button class="okButton" disabled={!inputIsValid} on:click={okClick}>
        <i class="material-icons">check</i>
      </button>
      <button class="cancelButton" on:click={clickOutsideOrCancel}>
        <i class="material-icons">close</i>
      </button>
    </div>
  </div>
</div>

<style lang="sass">
.modal
  z-index: 100
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  background: colors.$modal-backdrop
  backdrop-filter: blur(2px)

  display: flex
  justify-content: center
  align-items: center
  
  h1
    font-size: 3rem

.dialog
  width: min(90vw, 50ch)
  border-radius: 6px
  padding: 1rem
  background: colors.$modal-background
  filter: colors.$e-drop-shadow
  input
    width: 100%
    height: 2rem
    margin: 1rem 0

    outline: none
    background: transparent
    color: colors.$text
    border: transparent
    border-bottom: 2px solid  colors.$notice-ok
    font-size: 2rem
    padding: 0 0.5rem

    &.invalid
      border-bottom: 2px solid  colors.$notice-error

  .button-container
    display: flex
    flex-direction: row
    justify-content: space-around

.okButton,
.cancelButton
  cursor: pointer
  width: 2.5rem
  height: 2.5rem
  border: none
  border-radius: 50%
  background: #0003

.okButton
  color: colors.$notice-ok
  &:disabled
    color: colors.$text-mute
    cursor: default
.cancelButton
  color: colors.$notice-error
</style>
