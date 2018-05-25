$(document).ready(function () {
// Define the dimensions of the visualization. We're using
// a size that's convenient for displaying the graphic on
// http://jsDataV.is

var ws = new WebSocket(`ws://${location.host}`);

// One other parameter for our visualization determines how
// fast (or slow) the animation executes. It's a time value
// measured in milliseconds.
var animationStep = 1000;

var width = 625,
    height = 280;


//holds realtime values

var dataNodes4 = [];
var dataLinks4 = [];

var got_doctor = false
var got_nurse = false
var x_counter = 0
var y_counter = 0

ws.onopen = function () {
    console.log('Successfully connect WebSocket');
}
ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    
    var read_data = JSON.parse(message.data);
    
    if (read_data["bayState"] == "1"){
       d3.select("#svgcontainer4").style('background-color','yellow')
       force4.start()
    }
    else{
        d3.select("#svgcontainer4").style('background-color','gray')
        reset()
        
    }

    var new_nodes = []
    var new_links = []
    if (read_data["device_id"] == "EmerZen_Device2" && read_data["bayState"] == "1"){  

        if (read_data["MAC2"] == "C80F10329466"){
            node_ = { x: width/10 + x_counter, y: height/2 + y_counter, type: "Doctor" }
            link_ = { source: 0, target: 1, className: 'red'}    
            new_nodes.push(node_)
            new_links.push(link_)
            got_doctor = true
            x_counter++
            y_counter++
        
        }else{
            node_ = {x: width, y: height/2, type: ""}
            new_links.push({})
            new_nodes.push(node_)
        }
            
        if ( read_data['MAC3'] == "C80F10325F00"){
            node_ = { x: width/16 + x_counter + 2, y: height/4 + y_counter + 2, type: "Nurse" }
            link_ = { source: 1, target: 0, className: 'red'}

            new_nodes.push(node_)
            new_links.push(link_)
            got_nurse = true
            x_counter++
            y_counter++
            
        }else{
            node_ = {x: width, y:   height/2, type: ""}
            new_nodes.push(node_)
            new_links.push({})

        }

        node_ = {x: width, y:   height/2, type: ""}
        new_nodes.push(node_)

        simulate(new_nodes,new_links)
    }
    
}

// Next define the main object for the layout. We'll also
// define a couple of objects to keep track of the D3 selections
// for the nodes and the links. All of these objects are
// initialized later on.

var force = null,
    nodes = null,
    links = null;
    force2 = null,
    nodes2 = null,
    links2 = null;
    force3 = null,
    nodes3 = null,
    links3 = null;
   // force4 = null,
   // nodes4 = null,
   // links4 = null;

// We can also create the SVG container that will hold the
// visualization. D3 makes it easy to set this container's
// dimensions and add it to the DOM.

var svg = d3.select("#svgcontainer1").append('svg')
    .attr('width', width)
    .attr('height', height);

var svg2 = d3.select("#svgcontainer2").append('svg')
    .attr('width', width)
    .attr('height', height);

var svg3 = d3.select("#svgcontainer3").append('svg')
    .attr('width', width)
    .attr('height', height);

var svg4 = d3.select("#svgcontainer4").append('svg')
    .attr('width', width)
    .attr('height', height);


var BedCircle = svg.append("circle")
        .attr("fill", "steelblue")
        .attr("r", 20)
        .attr('cx', width)          
        .attr('cy', height/2);

var force4 = d3.layout.force()
            .size([width, height])
            .nodes([{x: width, y:   height/2, type: ""}]) // initialize with a single node
            .on("tick", stepForce4);

            //.links([{ source: 1, target: 0, className: 'red'}])

force4.linkDistance(height/8);           
force4.linkStrength(function(link) {
        if (link.className === 'red')  return .1;
        return 1;
    });

var nodes4 = force4.nodes(),
            links4 = force4.links(),
            node4 = svg4.selectAll(".node"),
            link4 = svg4.selectAll(".link");

var nodeEnter = null

link4 = svg4.selectAll('.link')
    .data(links4)
    .enter().append('dots')
    .attr('class', 'link')
    .attr('x1', function(d) { return nodes4[d.source].x; })
    .attr('y1', function(d) { return nodes4[d.source].y; })
    .attr('x2', function(d) { return nodes4[d.target].x; })
    .attr('y2', function(d) { return nodes4[d.target].y; })
    .attr('x3', function(d) { return nodes4[d.source].x; })
    .attr('y3', function(d) { return nodes4[d.target].y; })
    .attr('x4', function(d) { return 0 })
    .attr('y4', function(d) { return 0 });

link4.each(function(d){
if (d.className) {
    d3.select(this).classed(d.className, true)
}
});

nodeEnter = svg4.selectAll('.node')
.data(nodes4)
.enter().append('circle')
.attr('class', 'node')
.attr('r', width/10)
.attr('fill',circleColour)
.attr('cx', function(d) { return d.x; })
.attr('cy', function(d) { return d.y; });


//force4.linkStrength(function(link) {
//    if (link.className === 'red')  return .1;
 //   return 1;
//});

function get_links() {
    var seed = Math.floor(Math.random() * 100)
    link4_ = {"source" : 1, "target" :Math.floor(seed / 100)}
    return link4_
}


function reset(){
   
   svg4.selectAll('*').remove();
   
   var new_nodes = []
   var new_links = []
   
   node_ = {x: width, y:   height/2, type: ""}
   new_nodes.push(node_)

}

function simulate(node4_,link4_) {
        
          //links4.push(link4_)
          //nodes4 = nodes4.concat(node4_)
          //link4 = link4.data(link4_);

          link4 = svg4.selectAll('.link')
                .data(link4_)
                .enter().append('dots')
                .attr('class', 'link')
                .attr('x1', function(d) { return node4_[d.source].x; })
                .attr('y1', function(d) { return node4_[d.source].y; })
                .attr('x2', function(d) { return node4_[d.target].x; })
                .attr('y2', function(d) { return node4_[d.target].y; })
                .attr('x3', function(d) { return node4_[d.source].x; })
                .attr('y3', function(d) { return node4_[d.source].y; })
                .attr('x4', function(d) { return 0 })
                .attr('y4', function(d) { return 0 });

        link4.each(function(d){
        if (d.className) {
                d3.select(this).classed(d.className, true)
            }
        });
        
        nodeEnter = svg4.selectAll('.node')
            .data(node4_)
            .enter().append('circle')
            .attr('class', 'node')
            .attr('r', width/10)
            .attr('fill',circleColour)
            .attr('cx', function(d) { return d.x; })
            .attr('cy', function(d) { return d.y; });

     

        nodeEnter.transition().ease('linear').duration(animationStep*3)
            .attr('cx', function(d) { return d.x; })
            .attr('cy', function(d) { return d.y; });

           label.attr("x", function(d){ return d.x; })
                 .attr("y", function (d) {return d.y - 10; });

   
        link4.transition().ease('linear').duration(animationStep*2)
            .attr('x1', function(d) { return d.source.x; })
            .attr('y1', function(d) { return d.source.y; })
            .attr('x2', function(d) { return d.target.x; })
            .attr('y2', function(d) { return d.target.y; });
    

    // Unless the layout is operating at normal speed, we
    // only want to show one step at a time.

    if (!force4.fullSpeed) {
        force4.stop();
    }

    // If we're animating the layout in slow motion, continue
    // after a delay to allow the animation to take effect.

    if (force4.slowMotion) {
        setTimeout(
            function() { force4.start();  },
            animationStep*2
        );
    }
     stepForce4();
     //force4.start();
     //force4.start();
}


// Now we'll define a few helper functions. You might not
// need to make these named function in a typical visualization,
// but they'll make it easy to control the visualization in
// this case.

// First up is a function to initialize our visualization.
var initForce = function() {

    // Before we do anything else, we clear out the contents
    // of the SVG container. This step makes it possible to
    // restart the layout without refreshing the page.

    svg.selectAll('*').remove();
    svg2.selectAll('*').remove();
    svg3.selectAll('*').remove();

    // Define the data for the example. In general, a force layout
    // requires two data arrays. The first array, here named `nodes`,
    // contains the object that are the focal point of the visualization.
    // The second array, called `links` below, identifies all the links
    // between the nodes. (The more mathematical term is "edges.")

    // As far as D3 is concerned, nodes are arbitrary objects.
    // Normally the objects wouldn't be initialized with `x` and `y`
    // properties like we're doing below. When those properties are
    // present, they tell D3 where to place the nodes before the force
    // layout starts its magic. More typically, they're left out of the
    // nodes and D3 picks random locations for each node. We're defining
    // them here so we can get a consistent application of the layout.

    var dataNodes = [
        { x: width, y:  height/2, type: "" },
        { x: -150, y:   height/2, type:"Nurse"},
        { x: -150, y:   height, type:"Nurse" },
        { x: -150, y:   height , type:"Doctor"}   
    ];

    var dataNodes2 = [
        { x: width, y:   height/2, type: "" },
        { x: -10, y:   height/2, type:"Nurse"},
        { x: -50, y:   height/3, type:"Nurse" },
        { x: -30, y: height , type:"Doctor"}   
    ];

    var dataNodes3 = [
        { x: width, y:   height/2, type: "" },
        { x: 0, y:   height/2, type:"Nurse"},
        { x: 0, y:   height/3, type:"Nurse" },
        { x: 0, y: height , type:"Doctor"}   
    ];

    // The `links` array contains objects with a `source` and a `target`
    // property. The values of those properties are the indices in
    // the `nodes` array of the two endpoints of the link. Our links
    // bind the first three nodes into one graph and leave the last
    // two nodes isolated.

    var dataLinks = [
        { source: 1, target: 0, className: 'red'},
        { source: 3, target: 1},
        { source: 3, target: 2},
        { source: 1, target: 3},
        { source: 3, target: 2},
    ];

     var dataLinks2 = [
        { source: 2, target: 0, className: 'red'},
        { source: 1, target: 2},
        { source: 3, target: 1},
        { source: 2, target: 3},
        { source: 1, target: 2},
        { source: 3, target: 2},
    ];

     var dataLinks3 = [
        { source: 2, target: 0, className: 'red'},
        { source: 1, target: 0},
        { source: 3, target: 1},
        { source: 2, target: 3},
        { source: 1, target: 2},
        { source: 3, target: 1},
    ];

    // Now we create a force layout object and define its properties.
    // Those include the dimensions of the visualization and the arrays
    // of nodes and links.

    force = d3.layout.force()
        .size([width, height])
        .nodes(dataNodes)
        .links(dataLinks);

    force2 = d3.layout.force()
        .size([width, height])
        .nodes(dataNodes2)
        .links(dataLinks2);
    

    force3 = d3.layout.force()
        .size([width, height])
        .nodes(dataNodes3)
        .links(dataLinks3);

    // Define the `linkDistance` for the graph. This is the
    // distance we desire between connected nodes.

    force.linkDistance(height/2);
    force2.linkDistance(height/4);
    force3.linkDistance(height);

    // Here's the part where things get interesting. Because
    // we're looking at the `linkStrength` property, that's what
    // we want to vary between the read and blue nodes. Most often
    // this property is set to a constant value for an entire
    // visualization, but D3 also lets us define it as a function.
    // When we do that, we can set a different value for each node.

    force.linkStrength(function(link) {
        if (link.className === 'red')  return .1;
        return 1;
    });

    force2.linkStrength(function(link) {
        if (link.className === 'red')  return .1;
        return 1;
    });

    // Next we'll add the nodes and links to the visualization.
    // Note that we're just sticking them into the SVG container
    // at this point. We start with the links. The order here is
    // important because we want the nodes to appear "on top of"
    // the links. SVG doesn't really have a convenient equivalent
    // to HTML's `z-index`; instead it relies on the order of the
    // elements in the markup. By adding the nodes _after_ the
    // links we ensure that nodes appear on top of links.

    // Links are pretty simple. They're just SVG lines. We're going
    // to position the lines according to the centers of their
    // source and target nodes. You'll note that the `source`
    // and `target` properties are indices into the `nodes`
    // array. That's how our data is structured and that's how
    // D3's force layout expects its inputs. As soon as the layout
    // begins executing, however, it's going to replace those
    // properties with references to the actual node objects
    // instead of indices.

    links = svg.selectAll('.link')
        .data(dataLinks)
        .enter().append('dots')
        .attr('class', 'link')
        .attr('x1', function(d) { return dataNodes[d.source].x; })
        .attr('y1', function(d) { return dataNodes[d.source].y; })
        .attr('x2', function(d) { return dataNodes[d.target].x; })
        .attr('y2', function(d) { return dataNodes[d.target].y; })
        .attr('x3', function(d) { return dataNodes[d.source].x; })
        .attr('y3', function(d) { return dataNodes[d.source].y; })
        .attr('x4', function(d) { return dataNodes[d.target].x; })
        .attr('y4', function(d) { return dataNodes[d.target].y; });



    links2 = svg2.selectAll('.link')
        .data(dataLinks2)
        .enter().append('dots')
        .attr('class', 'link')
        .attr('x1', function(d) { return dataNodes[d.source].x; })
        .attr('y1', function(d) { return dataNodes[d.source].y; })
        .attr('x2', function(d) { return dataNodes[d.target].x; })
        .attr('y2', function(d) { return dataNodes[d.target].y; })
        .attr('x3', function(d) { return dataNodes[d.source].x; })
        .attr('y3', function(d) { return dataNodes[d.source].y; })
        .attr('x4', function(d) { return 0 })
        .attr('y4', function(d) { return 0 });

    links3 = svg3.selectAll('.link')
        .data(dataLinks3)
        .enter().append('dots')
        .attr('class', 'link')
        .attr('x1', function(d) { return dataNodes[d.source].x; })
        .attr('y1', function(d) { return dataNodes[d.source].y; })
        .attr('x2', function(d) { return dataNodes[d.target].x; })
        .attr('y2', function(d) { return dataNodes[d.target].y; });


    // Now it's the nodes turn. Each node is drawn as a circle and
    // given a radius and initial position within the SVG container.
    // As is normal with SVG circles, the position is specified by
    // the `cx` and `cy` attributes, which define the center of the
    // circle. We actually don't have to position the nodes to start
    // off, as the force layout is going to immediately move them.
    // But this makes it a little easier to see what's going on
    // before we start the layout executing.

    nodes = svg.selectAll('.node')
        .data(dataNodes)
        .enter().append('circle')
        .attr('class', 'node')
        .attr('r', width/10)
        .attr('fill',circleColour)
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })


    nodes2 = svg2.selectAll('.node')
        .data(dataNodes2)
        .enter().append('circle')
        .attr('class', 'node')
        .attr('r', width/10)
        .attr('fill',circleColour)
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; });

    nodes3 = svg3.selectAll('.node')
        .data(dataNodes3)
        .enter().append('circle')
        .attr('class', 'node')
        .attr('r', width/10)
        .attr('fill',circleColour)
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; });


    label = svg.selectAll(".mytext")
        .data(dataNodes)
        .enter()
        .append("text")
        .text(function (d) { return d.type; })
        .style("text-anchor", "middle")
        .style("text-color", "black")
        .style("fill", "#000")
        .style("font-family", "Arial")
        .style("font-size", 20);

    label2 = svg2.selectAll(".mytext")
        .data(dataNodes2)
        .enter()
        .append("text")
        .text(function (d) { return d.type; })
        .style("text-anchor", "middle")
        .style("text-color", "black")
        .style("fill", "#000")
        .style("font-family", "Arial")
        .style("font-size", 20);
    

    // If we've defined a class name for a link, add it to the
    // element. We'll use the D3 `each` function to iterate
    // through the selection. The parameter passed to that
    // function is the data objected associated with the
    // selection which, by convention, is parameterized as `d`.
    // In our case that will be the link object.

    // Also in the `each` function, the context (`this`) is
    // set to the associated node in the DOM.

    links.each(function(d){
        if (d.className) {
            d3.select(this).classed(d.className, true)
        }
    });

     links2.each(function(d){
        if (d.className) {
            d3.select(this).classed(d.className, true)
        }
    });

      links3.each(function(d){
        if (d.className) {
            d3.select(this).classed(d.className, true)
        }
    });

    // Finally we tell D3 that we want it to call the step
    // function at each iteration.

    force.on('tick', stepForce);
    force2.on('tick', stepForce2);
    force3.on('tick', stepForce3);



    force.slowMotion = true;
    force.fullSpeed  = false;
    force2.slowMotion = true;
    force2.fullSpeed  = false;

    // Get the animation rolling

    force.start();
    force2.start();
    force4.start();
};





// The next function is the event handler that will execute
// at each iteration of the layout.

var stepForce = function() {

    // When this function executes, the force layout
    // calculations have been updated. The layout will
    // have set various properties in our nodes and
    // links objects that we can use to position them
    // within the SVG container.

    // First let's reposition the nodes. As the force
    // layout runs it updates the `x` and `y` properties
    // that define where the node should be centered.
    // To move the node, we set the appropriate SVG
    // attributes to their new values.

    // The code here differs depending on whether or
    // not we're running the layout at full speed.
    // In full speed we simply set the new positions.

    if (force.fullSpeed) {

        nodes.attr('cx', function(d) { return d.x; })
            .attr('cy', function(d) { return d.y; });

       label.attr("x", function(d){ return d.x; })
                 .attr("y", function (d) {return d.y - 10; });


    // Otherwise, we use a transition to move them to
    // their positions instead of simply setting the
    // values abruptly.

    } else {

        nodes.transition().ease('easeCubic').duration(animationStep)
            .attr('cx', function(d) { return d.x; })
            .attr('cy', function(d) { return d.y; });

           label.attr("x", function(d){ return d.x; })
                 .attr("y", function (d) {return d.y - 10; });

    }

    // We also need to update positions of the links.
    // For those elements, the force layout sets the
    // `source` and `target` properties, specifying
    // `x` and `y` values in each case.

    // Here's where you can see how the force layout has
    // changed the `source` and `target` properties of
    // the links. Now that the layout has executed at least
    // one iteration, the indices have been replaced by
    // references to the node objects.

    // As with the nodes, at full speed we don't use any
    // transitions.

    if (force.fullSpeed) {

        links.attr('x1', function(d) { return d.source.x; })
            .attr('y1', function(d) { return d.source.y; })
            .attr('x2', function(d) { return d.target.x; })
            .attr('y2', function(d) { return d.target.y; });

    } else {

        links.transition().ease('easeCubic').duration(animationStep)
            .attr('x1', function(d) { return d.source.x; })
            .attr('y1', function(d) { return d.source.y; })
            .attr('x2', function(d) { return d.target.x; })
            .attr('y2', function(d) { return d.target.y; });
    }

    // Unless the layout is operating at normal speed, we
    // only want to show one step at a time.

    if (!force.fullSpeed) {
        force.stop();
    }

    // If we're animating the layout in slow motion, continue
    // after a delay to allow the animation to take effect.

    if (force.slowMotion) {
        setTimeout(
            function() { force.start();  },
            animationStep
        );
    }

}

var stepForce2 = function() {

    // When this function executes, the force layout
    // calculations have been updated. The layout will
    // have set various properties in our nodes and
    // links objects that we can use to position them
    // within the SVG container.

    // First let's reposition the nodes. As the force
    // layout runs it updates the `x` and `y` properties
    // that define where the node should be centered.
    // To move the node, we set the appropriate SVG
    // attributes to their new values.

    // The code here differs depending on whether or
    // not we're running the layout at full speed.
    // In full speed we simply set the new positions.

    if (force2.fullSpeed) {

        nodes2.attr('cx', function(d) { return d.x; })
            .attr('cy', function(d) { return d.y; });


       /* label2.attr("x", function(d){ return d.x; })
                 .attr("y", function (d) {return d.y - 10; });*/

    // Otherwise, we use a transition to move them to
    // their positions instead of simply setting the
    // values abruptly.

    } else {

        nodes2.transition().ease('easeBounce').duration(animationStep*2)
            .attr('cx', function(d) { return d.x; })
            .attr('cy', function(d) { return d.y; });


        label2.attr("x", function(d){ return d.x; })
                 .attr("y", function (d) {return d.y - 10; });
    }

    // We also need to update positions of the links.
    // For those elements, the force layout sets the
    // `source` and `target` properties, specifying
    // `x` and `y` values in each case.

    // Here's where you can see how the force layout has
    // changed the `source` and `target` properties of
    // the links. Now that the layout has executed at least
    // one iteration, the indices have been replaced by
    // references to the node objects.

    // As with the nodes, at full speed we don't use any
    // transitions.

    if (force2.fullSpeed) {

        links2.attr('x1', function(d) { return d.source.x; })
            .attr('y1', function(d) { return d.source.y; })
            .attr('x2', function(d) { return d.target.x; })
            .attr('y2', function(d) { return d.target.y; });

    } else {

        links2.transition().ease('easeBounce').duration(animationStep)
            .attr('x1', function(d) { return d.source.x; })
            .attr('y1', function(d) { return d.source.y; })
            .attr('x2', function(d) { return d.target.x; })
            .attr('y2', function(d) { return d.target.y; });
    }

    // Unless the layout is operating at normal speed, we
    // only want to show one step at a time.

    if (!force2.fullSpeed) {
        force2.stop();
    }

    // If we're animating the layout in slow motion, continue
    // after a delay to allow the animation to take effect.

    if (force2.slowMotion) {
        setTimeout(
            function() { force2.start(); },
            animationStep*3
        );
    }

}

var stepForce3 = function() {

    if (force3.fullSpeed) {

        nodes3.attr('cx', function(d) { return d.x; })
            .attr('cy', function(d) { return d.y; });

      /*  label.attr("x", function(d){ return d.x; })
                 .attr("y", function (d) {return d.y - 10; });*/

    } else {

        nodes3.transition().ease('linear').duration(animationStep*3)
            .attr('cx', function(d) { return d.x; })
            .attr('cy', function(d) { return d.y; });

           /* label.attr("x", function(d){ return d.x; })
                 .attr("y", function (d) {return d.y - 10; });*/

    }


    if (force3.fullSpeed) {

        links.attr('x1', function(d) { return d.source.x; })
            .attr('y1', function(d) { return d.source.y; })
            .attr('x2', function(d) { return d.target.x; })
            .attr('y2', function(d) { return d.target.y; });

    } else {

        links.transition().ease('linear').duration(animationStep*2)
            .attr('x1', function(d) { return d.source.x; })
            .attr('y1', function(d) { return d.source.y; })
            .attr('x2', function(d) { return d.target.x; })
            .attr('y2', function(d) { return d.target.y; });
    }

    // Unless the layout is operating at normal speed, we
    // only want to show one step at a time.

    if (!force3.fullSpeed) {
        force3.stop();
    }

    // If we're animating the layout in slow motion, continue
    // after a delay to allow the animation to take effect.

    if (force3.slowMotion) {
        setTimeout(
            function() { force3.start();  },
            animationStep*2
        );
    }

}



var stepForce4 = function() {

    if (force4.fullSpeed) {

        node4.attr('cx', function(d) { return d.x; })
            .attr('cy', function(d) { return d.y; });

      label.attr("x", function(d){ return d.x; })
                 .attr("y", function (d) {return d.y - 10; });

    } else {

        node4.transition().ease('linear').duration(animationStep*3)
            .attr('cx', function(d) { return d.x; })
            .attr('cy', function(d) { return d.y; });

            label.attr("x", function(d){ return d.x; })
                 .attr("y", function (d) {return d.y - 10; });

    }


    if (force4.fullSpeed) {

        link4.attr('x1', function(d) { return d.source.x; })
            .attr('y1', function(d) { return d.source.y; })
            .attr('x2', function(d) { return d.target.x; })
            .attr('y2', function(d) { return d.target.y; });

    } else {
 
        link4.transition().ease('linear').duration(animationStep*2)
            .attr('x1', function(d) { return d.source.x; })
            .attr('y1', function(d) { return d.source.y; })
            .attr('x2', function(d) { return d.target.x; })
            .attr('y2', function(d) { return d.target.y; });
    }

    // Unless the layout is operating at normal speed, we
    // only want to show one step at a time.

    if (!force4.fullSpeed) {
        force4.stop();
    }

    // If we're animating the layout in slow motion, continue
    // after a delay to allow the animation to take effect.

    if (force4.slowMotion) {
        setTimeout(
            function() { force4.start();  },
            animationStep*2
        );
    }

}


/** Functions **/

//Function to choose what color circle we have
//Let's return blue for males and red for females
function circleColour(d){
    if(d.type =="Doctor"){
        return "blue";
    }else if(d.type =="Nurse"){
        return "white";
    }  
    else {
        return "green";
    }
}

// Now let's take care of the user interaction controls.
// We'll add functions to respond to clicks on the individual
// buttons.

// When the user clicks on the "Advance" button, we
// start the force layout (The tick handler will stop
// the layout after one iteration.)

d3.select('#advance').on('click', function() {

    force.start();
     force2.start();
});

// When the user clicks on the "Slow Motion" button, we're
// going to run the force layout until it concludes.

d3.select('#slow').on('click', function() {

    // Indicate that the animation is in progress.

    force.slowMotion = true;
    force.fullSpeed  = false;
    force2.slowMotion = true;
    force2.fullSpeed  = false;

    // Get the animation rolling

    force.start();
    force2.start();

});

// When the user clicks on the "Slow Motion" button, we're
// going to run the force layout until it concludes.

d3.select('#play').on('click', function() {

    // Indicate that the full speed operation is in progress.

    force.slowMotion = false;
    force.fullSpeed  = true;
    force2.slowMotion = false;
    force2.fullSpeed  = true;

    // Get the animation rolling

    force.start();
    force2.start();

});

// When the user clicks on the "Reset" button, we'll
// start the whole process over again.

d3.select('#reset').on('click', function() {

    // If we've already started the layout, stop it.
    if (force) {
        force.stop();
    }
    if (force2) {
        force2.stop();
    }

    // Re-initialize to start over again.

    initForce();

});

// Now we can initialize the force layout so that it's ready
// to run.

initForce();






});

