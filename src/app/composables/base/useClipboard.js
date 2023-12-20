export default function useClipboard() {
  
   /**
   * Write a string to the user's clipboard
   * @param  {String} value
   */
  function copyToClipboard(value) {
    let input = document.createElement('input')
    input.value = value
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
  }

  return {
    copyToClipboard
  }
}
