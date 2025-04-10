// --- Configuration ---
// The exact class string provided in the prompt
const targetClass = "border border-super/20 bg-super/10 hover:bg-super/20 hover:border-super/30 text-super dark:border-superDark/20 dark:bg-superDark/10 dark:text-superDark dark:hover:bg-superDark/20 dark:hover:border-superDark/30 px-2.5 font-sans focus:outline-none outline-none outline-transparent transition duration-300 ease-out font-sans  select-none items-center relative group/button  justify-center text-center items-center rounded-full cursor-pointer active:scale-[0.97] active:duration-150 active:ease-outExpo origin-center whitespace-nowrap inline-flex text-sm h-8 aspect-square";

// CSS selector to find the button using its exact class attribute
const selector = `button[class="${targetClass}"]`;

// --- State ---
let observer = null; // To hold the MutationObserver instance
let clicked = false; // Flag to ensure the click happens only once per load
const OBSERVER_TIMEOUT = 15000; // Stop searching after 15 seconds

// --- Core Logic ---
function findAndClickButton() {
    // Don't do anything if we've already successfully clicked
    if (clicked) {
        return true;
    }

    const button = document.querySelector(selector);

    if (button) {
        console.log("Perplexity Auto-Clicker: Found target button.");
        try {
            button.click();
            clicked = true; // Set flag indicating success
            console.log("Perplexity Auto-Clicker: Button clicked successfully.");

            // If the observer is active, disconnect it as we're done
            if (observer) {
                observer.disconnect();
                console.log("Perplexity Auto-Clicker: Observer disconnected.");
            }
            return true; // Indicate success
        } catch (error) {
            console.error("Perplexity Auto-Clicker: Error clicking button:", error);
            // Still disconnect observer if an error occurred during click attempt
             if (observer) {
                observer.disconnect();
            }
            return false; // Indicate failure
        }
    }

    return false; // Indicate button not found yet
}

// --- Initialization ---

// 1. Try finding and clicking the button immediately when the script runs.
if (!findAndClickButton()) {
    // 2. If not found immediately, set up a MutationObserver to watch for changes.
    // This handles cases where the button is added dynamically after initial load.
    console.log("Perplexity Auto-Clicker: Button not found initially. Setting up MutationObserver.");

    observer = new MutationObserver((mutationsList, obs) => {
        // Check if the button appeared after a DOM mutation
        findAndClickButton();
        // Note: findAndClickButton() will disconnect the observer if successful.
    });

    // Start observing the document body for added/removed nodes in the subtree
    observer.observe(document.body, {
        childList: true, // Watch for direct children changes
        subtree: true    // Watch for changes in all descendants
    });

    // 3. Set a timeout to stop observing if the button isn't found after a while.
    // Prevents the observer running indefinitely on pages where the button might never appear.
    setTimeout(() => {
        if (!clicked && observer) { // Only disconnect if it's still active and we haven't clicked
            observer.disconnect();
            console.log(`Perplexity Auto-Clicker: Observer timed out after ${OBSERVER_TIMEOUT / 1000} seconds. Button not found.`);
        }
    }, OBSERVER_TIMEOUT);

} else {
    // Button was found and clicked on the initial attempt
    console.log("Perplexity Auto-Clicker: Button found and clicked on initial check.");
}