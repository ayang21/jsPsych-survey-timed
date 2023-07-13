//Checks if the input str is valid or not
function validInput(str, dataArray) {
    const specialChars =/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    //Checks if there are numbers
    var hasNum = /\d/.test(str) || (str.replace(/\s+/g, '') == "");
    //Checks if there are special characters
    var hasSpecialChars = specialChars.test(str);

    //Checks if there are any repeats
    var hasRepeat = dataArray.includes(str);
    var valid = hasNum + hasSpecialChars + hasRepeat;

    return valid === 0;
  }
  
//Loops through user input until it either reaches the max inputs, or the time runs out
function repeat_form(data, len){
    var entries = document.getElementById("input-1");
    entriesVal = entries.value;
    
    if (validInput(entriesVal, data)){
        data.push(entriesVal);
        document.getElementById("list-of-entries").innerHTML += '<p style = "border: solid #666666 1px; padding: none; margin: 2px; border-radius: 5px;"> ' + '<span class="remove-icon">&#10006;</span>' + entriesVal + "</p>";
    }
    // document.getElementById('test').style.animation = 'fading 2s infinite'
    entries.value = "";
    entries.focus();    
    if (data.length >= len){
        var trial_data = {
            response: survey_data,
        };
        // clear the display
        document.innerHTML = "";
        // move on to the next trial
        jsPsych.finishTrial(trial_data);
        survey_data = [];
    }
}

//Instantiates global variable used by html and JS
var survey_data = [];
var len = 0;

//Starts the plugin
var jsPsychSurveyTextTimed = (function (jspsych) {

    //Paramters used 
    const info = {
        name: "survey-text-timed",
        parameters: {
            prompt: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Prompt",
                default: undefined,
            },
            trial_duration: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Trial length",
                default: null,
            },
            max_inputs: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Max inputs",
                default: null,
            },
            placeholder: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Placeholder",
                default: "",
            },
            /** HTML-formatted string to display at top of the page above all of the questions. */
            preamble: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Preamble",
                default: null,
            },
            /** Label of the button to submit responses. */
            button_label: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Button label",
                default: "Add word",
            },
            /** Setting this to true will enable browser auto-complete or auto-fill for the form. */
            autocomplete: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Allow autocomplete",
                default: false,
            },
            
        },
    };
    /**
     * **survey-text-timed**
     *
     * jsPsych plugin for free text response survey questions
     *
     * @author Adam Yang
         */
    
    class SurveyTextTimedPlugin {

        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }

        trial(display_element, trial) {

            //If no user input for trial duration, set default time of 5 seconds
            if (trial.trial_duration == null) {
                trial.trial_duration = 5;
            }
            //If no user input for trial max inputs, set default to no limit
            if(trial.max_inputs == null){
                trial.max_inputs = Infinity;
            }
                
            var html = "";

            //Show preamble text
            if (trial.preamble !== null) {
                html +=
                    '<div id="jspsych-survey-text-timed-preamble" class="jspsych-survey-text-timed-preamble">' +
                        trial.preamble +
                        "</div>";
            }
            //Start form
            if (trial.autocomplete) {
                html += '<form id="jspsych-survey-text-timed-form">';
            }
            else {
                html += '<form id="jspsych-survey-text-timed-form" autocomplete="off">';
            }        
            //Add questions
            html +=
                '<div id="jspsych-survey-text-timed-1' +
                    '" class="jspsych-survey-text-timed-question" style="margin: 2em 0em;">';
            html += '<p class="jspsych-survey-text-timed">' + trial.prompt + "</p>";
            var autofocus = "autofocus"
            html +=
                '<input type="text" id="input-1' +
                    '"  name="#jspsych-survey-text-timed-response-1' +
                    '" data-name="' +
                    trial.name +
                    '" ' +
                    autofocus +
                    " " +
                    ' placeholder="' +
                    trial.placeholder +
                    '"></input>';
            
            html += "</div>";

            len = trial.max_inputs;

            //Add submit button
            html +=
                '<input type="next-trial" id="jspsych-survey-text-timed-next-trial" class="jspsych-btn jspsych-survey-text-timed" onclick = "repeat_form(survey_data, len)" value="' +
                trial.button_label +
                '"></input>';
            html += "</form>";

            //Add next trial button
            html +=
                '<input type="submit" id="jspsych-survey-text-timed-next" class="jspsych-btn jspsych-survey-text-timed" onclick = "(function(){jsPsych.finishTrial({response: survey_data}); survey_data = [];})();" value="Next Trial"></input>';
            html += "</form>";

            html += '<div id = "list-of-entries" style = "position: absolute; width: 10.6rem;"></div>'
            display_element.innerHTML = html;

            //Event listener to add the "x" for removing words you don't want added
            const container = document.getElementById('list-of-entries');
            container.addEventListener('click', (event) => {
              if (event.target.classList.contains('remove-icon')) {
                const paragraph = event.target.closest('p');
                paragraph.remove();
              }
            });

            var response_time = 0;

            //Backup in case autofocus doesn't work
            display_element.querySelector("#input-1").focus();
            display_element.querySelector("#jspsych-survey-text-timed-form").addEventListener("submit", (e) => {
                e.preventDefault();
                //Measure response time  
                var endTime = performance.now();
                response_time = Math.round(endTime - startTime);
                //Create object to hold responses
            });

            //Function to end the trial 
            const end_trial = () => {
                //Kill any remaining setTimeout handlers
                this.jsPsych.pluginAPI.clearAllTimeouts();
                //Kill keyboard listeners
                if (typeof keyboardListener !== "undefined") {
                    this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
                }
                //Gather the data to store for the trial
                //Save data
                var trial_data = {
                    rt: response_time,
                    response: survey_data,
                };
                //Clear the display
                display_element.innerHTML = "";
                //Move on to the next trial
                this.jsPsych.finishTrial(trial_data);
                survey_data = [];
            };
            //Start timer 
            var startTime = performance.now();
            //Sets a timeout for a certain amount of seconds
            this.jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration * 1000);

            //Add custom css specifically to this trial
            var css = '#list-of-entries {margin: 0; padding: 5px; cursor: default;}' +
                '.remove-icon {position: absolute; top: 5px; right: 5px; cursor: pointer; color: red; visibility: hidden;}' + 
                '#list-of-entries p:hover .remove-icon {visibility: visible;}' + 
                'li {display: inline-block; margin-right: 2em; width: 6em;}' +
                '.numbers {display: block; font-family: sans-serif; font-size: 60px; line-height: 1.5; margin: 0 auto;}' +
                '.name {font-family: sans-serif; font-size: 20px; line-height: 1.5; margin: 0 auto; text-align: center; position: relative; top: -25px;}' +
                '#progressBar { width: 90%; margin: 10px auto; height: 22px; background-color: green;}' +
                '#progressBar div { height: 100%; text-align: right; padding: 0 10px; line-height: 22px; /* same as #progressBar height if we want text middle aligned */ width: 0; background-color: blue; box-sizing: border-box;}';
            var style = document.createElement('style');
            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            
            document.getElementsByTagName('head')[0].appendChild(style);
            

        }

    }
    SurveyTextTimedPlugin.info = info;
  
    return SurveyTextTimedPlugin;
  
  })(jsPsychModule);
  