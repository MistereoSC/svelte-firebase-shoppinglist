<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let input = "";
  onMount(() => {
    document.getElementById("inputField").focus();
  });

  function clickOutsideOrCancel() {
    dispatch("close");
  }
  function clickAdd() {
    dispatch("listAdded", {
      data: { title: input },
    });
  }
</script>

<div
  class="modal"
  on:click|self={clickOutsideOrCancel}
  on:keydown={(e) => {
    if (e.key === "Escape") clickOutsideOrCancel(e);
  }}
>
  <div class="dialog">
    <p>Add new list</p>
    <input
      id="inputField"
      type="text"
      bind:value={input}
      placeholder="Grocery Shop"
      autocomplete="off"
    />
    <div>
      <button
        id="addButton"
        disabled={input.length < 3 || input.length > 20}
        on:click={clickAdd}
      >
        ADD
      </button>
      <button id="cancelButton" on:click={clickOutsideOrCancel}>CANCEL</button>
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
  background: #0005

  display: flex
  justify-content: center
  align-items: center

.dialog
  width: min(90vw, 40ch)
  border-radius: 1rem
  padding: 1rem
  background: gray

  input
    width: 100%
    height: 2rem

</style>
