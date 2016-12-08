import React from 'react';
import ReactDOM from 'react-dom';
import WorkoutView from './WorkoutView'

it('Just renders without throwing', () => {
  expect(true).toEqual(true)
  
  const div = document.createElement('div');
  const props = {
    name: 'Annie',
    scoring: 'rounds',
    clusters: []
  }
  ReactDOM.render(<WorkoutView {...props} />, div);
})