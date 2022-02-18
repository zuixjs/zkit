zuix.$.find('main div').eq(0).on('animationend', () => {
  location.href = '{{ redirect | url }}';
});
