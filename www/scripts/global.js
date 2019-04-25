/* jshint browser: true */

/**
 * Normalized function to execute a callback after
 * te page is loaded.
 * @param  {Function} callback The function to run when the DOM is fully loaded. Takes no arguments
 */
root.onDOMContentLoaded = function(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Don't send any arguments from the event to the callback
      callback();
    });
  } else {
    // Execute the callback immediately if the page is already loaded
    callback();
  }
};
