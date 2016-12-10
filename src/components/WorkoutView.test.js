import 'react-native';
import React from 'react';
import WorkoutView from './WorkoutView'
import renderer from 'react-test-renderer';

it('(WorkoutView) Output matches snapshots', () => {
  const workouts = [{
    "clusters": [
      {
        "repScheme": {
          "init": 10,
          "step": 2
        },
        "rounds": 2,
        "timing": {
          "deathBy": true,
          "time": 180,
          "type": "FixedCycles"
        },
        "units": [
          {
            "movement": {
              "aspects": [
                "reps",
                "load"
              ],
              "equipment": [
                "Barbell"
              ],
              "id": "/squat-overhead",
              "name": "Overhead Squat",
              "parent": "/movement/squat"
            },
            "movementID": "/squat-overhead",
            "rx": {
              "load": [
                95,
                65
              ],
              "unit": "lbs"
            }
          },
          {
            "movement": {
              "aspects": [
                "reps",
                "load"
              ],
              "equipment": [
                "Pull-Up Rig"
              ],
              "id": "/movement/chest-to-bar",
              "name": "Chest-to-Bar Pull-up"
            },
            "movementID": "/movement/chest-to-bar",
            "rx": {}
          }
        ]
      }
    ],
    "equipments": [
      "Barbell",
      "Pull-Up Rig"
    ],
    "id": "94315612-672a-4a7b-9119-433eaaf0bcad",
    "movements": [
      "/squat-overhead",
      "/movement/chest-to-bar"
    ],
    "name": "Open 14.2",
    "scoring": "cycles",
    "tags": [
      "cfg-open",
      "competition"
    ],
    "type": "VariableWorkVariableTime"
  },
  {
    "clusters": [
      {
        "timing": {
          "alias": "AMRAP 20 minutes",
          "time": 1200,
          "type": "Capped"
        },
        "units": [
          {
            "movement": {
              "aspects": [
                "distance",
                "load"
              ],
              "equipment": [
                "Body-weight"
              ],
              "id": "/movement/run",
              "name": "Run"
            },
            "movementID": "/movement/run",
            "rx": {
              "distance": 400,
              "unit": "meters"
            }
          },
          {
            "movement": {
              "aspects": [
                "reps",
                "load"
              ],
              "equipment": [
                "Pull-Up Rig"
              ],
              "id": "/movement/pull-up",
              "name": "Pull-Up"
            },
            "movementID": "/movement/pull-up",
            "rx": {
              "reps": "$AMRAP"
            }
          }
        ]
      }
    ],
    "equipments": [
      "Body-weight",
      "Pull-Up Rig"
    ],
    "id": "da740903-7a87-491f-aa3b-1ec1a215cc31",
    "movements": [
      "/movement/run",
      "/movement/pull-up"
    ],
    "name": "Nicole",
    "notes": [
      "Score is total of un-broken Pull-Ups completed each round."
    ],
    "scoring": "reps",
    "tags": [
      "girls"
    ],
    "type": "FixedTimeVariableWork"
  },
  {
    "clusters": [
      {
        "builtinRest": {
          "between": "rounds",
          "unit": "min",
          "value": 1
        },
        "rounds": 3,
        "timing": {
          "time": 60,
          "type": "TimedUnits"
        },
        "units": [
          {
            "movement": {
              "aspects": [
                "reps",
                "load"
              ],
              "equipment": [
                "Barbell",
                "Dumbbell",
                "Kettlebell",
                "Medicine Ball",
                "Plates"
              ],
              "id": "/movement/clean",
              "name": "Clean"
            },
            "movementID": "/movement/clean",
            "rx": {
              "load": 155,
              "reps": "1 minute ",
              "unit": "lbs"
            }
          },
          {
            "movement": {
              "aspects": [
                "distance",
                "load",
                "reps"
              ],
              "equipment": [
                "Body-weight"
              ],
              "id": "/movement/shuttle-sprint",
              "name": "Shuttle Sprint"
            },
            "movementID": "/movement/shuttle-sprint",
            "notes": [
              "20 ft foward, 20 ft backwards = 1 rep"
            ],
            "rx": {
              "reps": "1 minute "
            }
          },
          {
            "movement": {
              "aspects": [
                "reps",
                "load"
              ],
              "equipment": [
                "Barbell"
              ],
              "id": "/movement/deadlift",
              "name": "Deadlift"
            },
            "movementID": "/movement/deadlift",
            "rx": {
              "load": 245,
              "reps": "1 minute ",
              "unit": "lbs"
            }
          },
          {
            "movement": {
              "aspects": [
                "reps"
              ],
              "equipment": [
                "Body-weight"
              ],
              "id": "/movement/burpee",
              "name": "Burpee"
            },
            "movementID": "/movement/burpee",
            "rx": {
              "reps": "1 minute "
            }
          },
          {
            "movement": {
              "aspects": [
                "reps",
                "load"
              ],
              "equipment": [
                "Barbell"
              ],
              "id": "/movement/jerk",
              "name": "Jerk"
            },
            "movementID": "/movement/jerk",
            "rx": {
              "load": 155,
              "reps": "1 minute ",
              "unit": "lbs"
            }
          }
        ]
      }
    ],
    "equipments": [
      "Barbell",
      "Body-weight",
      "Dumbbell",
      "Kettlebell",
      "Medicine Ball",
      "Plates"
    ],
    "id": "9c5865f5-e71c-4a40-b9c0-e3a830a3ef07",
    "movements": [
      "/movement/clean",
      "/movement/shuttle-sprint",
      "/movement/deadlift",
      "/movement/burpee",
      "/movement/jerk"
    ],
    "name": "Santora",
    "scoring": "reps",
    "tags": [
      "hero"
    ],
    "type": "FixedTimeVariableWork"
  }
]

  for (let workout of workouts) {
    console.log(workout)
    const component = renderer.create(<WorkoutView {...workout} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  }

});
