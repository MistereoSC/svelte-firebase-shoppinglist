<script>
  import { getAuth, signInWithRedirect } from "firebase/auth";

  function loginClick() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  }
</script>

<header class="navbar">
  <span>
    <i class="material-icons">local_mall</i>
    <h1>Shoptastic</h1>
  </span>
</header>

<style lang="sass">
.navbar
  background: #0005

  span
    display: inline-block
    text-align: center
    i
      font-size: 3rem
      vertical-align: bottom
    h1
      font-size: 2.5rem
    *
      display: inline-block
</style>
