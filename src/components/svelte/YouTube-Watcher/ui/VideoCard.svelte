<script>
  import { createEventDispatcher } from "svelte";
  export let vid;

  const dispatch = createEventDispatcher();

  function handleClick(code, title) {
    dispatch("videoSelection", {
      videoCode: code,
      videoTitle: title,
    });
  }
</script>

<a
  class="video-card"
  on:click|preventDefault={handleClick(vid.html, vid.title)}
  href="#"
>
  <div class="video-card__title">{vid.title}</div>
  <img class="video-card__image" src={vid.thumbnail_url} alt="" />
</a>

<style lang="scss">
  .video-card {
    position: relative;
    height: 150px;
    display: block;
    overflow: hidden;
    border: 2px solid black;
    border-radius: 10px;
    background-color: black;
    transition: all 0.1s ease-in-out;

    &__image {
      position: absolute;
      left: 0;
      top: 0;
      opacity: 50%;
      max-width: 100%;
      z-index: 1;
    }

    &__title {
      background: linear-gradient(transparent, black 50%);
      left: 50%;
      bottom: 0;
      transform: translatex(-50%);
      z-index: 5;
      position: absolute;
      color: white;
      font-weight: bold;
      padding: 0 10px 5px;
      width: 100%;
      min-height: 45px;
    }

    &:hover {
      border-color: var(--secondary-color);
    }

    &:active {
      border-color: white;
    }
  }
</style>
