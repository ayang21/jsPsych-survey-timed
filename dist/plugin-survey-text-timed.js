// import React from 'react';
function containsNumbers(str) {
    return /\d/.test(str);
  }
function repeat_form(data){
    var entries = document.getElementById("input-1");
    entriesVal = entries.value;
    
    if (!containsNumbers(entriesVal)){
        data.push(entriesVal);
        document.getElementById("list-of-entries").innerHTML += '<p id = "entry-items" style = "border: solid #666666 1px; padding: none; margin: 2px; border-radius: 5px;"> ' + entriesVal + "</p>";
    }
    // document.getElementById('test').style.animation = 'fading 2s infinite'
    entries.value = "";
    entries.focus();    
        
}
var survey_data = [];
var jsPsychSurveyTextTimed = (function (jspsych) {

    // const [array, setArray] = React.useState0
    const info = {
        name: "survey-text-timed",
        parameters: {
            prompt: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Prompt",
                default: undefined,
            },
            trial_duaration: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Trial length",
                default: null,
            },
            target_num_inputs: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Num of inputs",
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
     * **survey-text**
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
            if (typeof trial.trial_duration == null) {
                trial.trial_duration = 5000;
            }

            var html = "";
            // show preamble text
            if (trial.preamble !== null) {
                html +=
                    '<div id="jspsych-survey-text-timed-preamble" class="jspsych-survey-text-timed-preamble">' +
                        trial.preamble +
                        "</div>";
            }
            // start form
            if (trial.autocomplete) {
                html += '<form id="jspsych-survey-text-timed-form">';
            }
            else {
                html += '<form id="jspsych-survey-text-timed-form" autocomplete="off">';
            }        
            // add questions
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

            // add submit button
            html +=
                '<input type="submit" id="jspsych-survey-text-timed-next" class="jspsych-btn jspsych-survey-text-timed" onclick = "repeat_form(survey_data)" value="' +
                    trial.button_label +
                    '"></input>';
            html += "</form>";

            html += '<div id = "list-of-entries" style = "position: absolute; width: 10.6rem;"></div>'
            display_element.innerHTML = html;

            var response_time = 0;
            // backup in case autofocus doesn't work
            display_element.querySelector("#input-1").focus();
            display_element.querySelector("#jspsych-survey-text-timed-form").addEventListener("submit", (e) => {
                e.preventDefault();
                // measure response time  
                var endTime = performance.now();
                response_time = Math.round(endTime - startTime);
                // create object to hold responses
            });
            const end_trial = () => {
                // kill any remaining setTimeout handlers
                this.jsPsych.pluginAPI.clearAllTimeouts();
                // kill keyboard listeners
                if (typeof keyboardListener !== "undefined") {
                    this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
                }
                // gather the data to store for the trial
                // save data
                var trial_data = {
                    rt: response_time,
                    response: survey_data,
                };
                // clear the display
                display_element.innerHTML = "";
                // move on to the next trial
                this.jsPsych.finishTrial(trial_data);
                survey_data = [];
            };
            var startTime = performance.now();
            this.jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration * 1000);

        }

        

        // simulate(trial, simulation_mode, simulation_options, load_callback) {
            //     if (simulation_mode == "data-only") {
                //         load_callback();
        //         this.simulate_data_only(trial, simulation_options);
        //     }
        //     if (simulation_mode == "visual") {
            //         this.simulate_visual(trial, simulation_options, load_callback);
            //     }
            // }
            // create_simulation_data(trial, simulation_options) {
                //     const trial_data = {};
                //     let rt = 1000;
        //     const name = trial.name ? trial.name : `Q1`;
        //     const ans_words = this.jsPsych.randomization.sampleExponential(0.25);
        //     trial_data[name] = this.jsPsych.randomization.randomWords({
        //         exactly: ans_words,
        //         join: " ",
        //     });
        //     rt += this.jsPsych.randomization.sampleExGaussian(2000, 400, 0.004, true);
    
        //     const default_data = {
        //         response: trial_data,
        //         rt: rt,
        //     };
        //     const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
        //     this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
        //     return data;
        // }
        // simulate_data_only(trial, simulation_options) {
        //     const data = this.create_simulation_data(trial, simulation_options);
        //     this.jsPsych.finishTrial(data);
        // }
        // simulate_visual(trial, simulation_options, load_callback) {
        //     const data = this.create_simulation_data(trial, simulation_options);
        //     const display_element = this.jsPsych.getDisplayElement();
        //     this.trial(display_element, trial);
        //     load_callback();
        //     const answers = Object.entries(data.response).map((x) => {
        //         return x[1];
        //     });
        //     for (let i = 0; i < answers.length; i++) {
        //         this.jsPsych.pluginAPI.fillTextInput(display_element.querySelector(`#input-${i}`), answers[i], ((data.rt - 1000) / answers.length) * (i + 1));
        //     }
        //     this.jsPsych.pluginAPI.clickTarget(display_element.querySelector("#jspsych-survey-text-timed-next"), data.rt);
        // }
    }
    SurveyTextTimedPlugin.info = info;
  
    return SurveyTextTimedPlugin;
  
  })(jsPsychModule);
  