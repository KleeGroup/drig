drig
========

Application grid component.

## Purpose

## How to use
In order to use the drig component it is super easy.
- Import the `drig.js` file in your project.
- In the **html** page add a container. 
```html
<div id='drigContainer'></div>
```
- In a **javascript** function which is called on the page initialization, initialize the component.
```javascript
$('.drigExampleContainer').drig({
            data: {
                applications: [{
                    id: 1,
                    order: 1,
                    name: "Application 1"
                }, {
                    id: 2,
                    order: 2,
                    name: "Application 2"
                }, {
                    id: 3,
                    order: 3,
                    name: "Application 3"
                }, {
                    id: 4,
                    order: 4,
                    name: "Application 4"
                }]
            }
});
```