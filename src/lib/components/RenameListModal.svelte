<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let value = {
    subListID: "0000",
    subListName: "Test",
  };
  let input = "";
  onMount(() => {
    document.getElementById("inputField").focus();
  });

  function clickOutsideOrCancel() {
    dispatch("close");
  }
  function clickAdd() {
    dispatch("rename", {
      subListID: value.subListID,
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
    <p>Renaming {value.subListName}</p>
    <input
      id="inputField"
      type="text"
      bind:value={input}
      placeholder="to . . ."
      autocomplete="off"
    />
    <div>
      <button id="addButton" disabled={input.length < 3} on:click={clickAdd}>
        OK
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
