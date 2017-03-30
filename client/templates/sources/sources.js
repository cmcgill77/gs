Meteor.subscribe('sources');
Meteor.subscribe('postsBySource');

Template.sources.rendered = function() {

    //click on search sort type
    $('#loc-sort').trigger('click');
    Session.set('selectedSource', '');
    Session.set('selectedName', '');
    Session.set('graphClicked', false)


    //extension logic -- this stuff feeds the graph new data at a set interval and enable the render controls (area, bar, stack stream, etc)
    //feeding random numbers for now will connect posts by source to individual series

    var RenderControls = function(args) {

        var $ = jQuery;

        this.initialize = function() {

            this.element = args.element;
            this.graph = args.graph;
            this.settings = this.serialize();

            this.inputs = {
                renderer: this.element.elements.renderer,
                interpolation: this.element.elements.interpolation,
                offset: this.element.elements.offset
            };

            this.element.addEventListener('change', function(e) {

                this.settings = this.serialize();

                if (e.target.name == 'renderer') {
                    this.setDefaultOffset(e.target.value);
                }

                this.syncOptions();
                this.settings = this.serialize();

                var config = {
                    renderer: this.settings.renderer,
                    interpolation: this.settings.interpolation
                };

                if (this.settings.offset == 'value') {
                    config.unstack = true;
                    config.offset = 'zero';
                } else if (this.settings.offset == 'expand') {
                    config.unstack = false;
                    config.offset = this.settings.offset;
                } else {
                    config.unstack = false;
                    config.offset = this.settings.offset;
                }

                this.graph.configure(config);
                this.graph.render();

            }.bind(this), false);
        }

        this.serialize = function() {

            var values = {};
            var pairs = $(this.element).serializeArray();

            pairs.forEach(function(pair) {
                values[pair.name] = pair.value;
            });

            return values;
        };

        this.syncOptions = function() {

            var options = this.rendererOptions[this.settings.renderer];

            Array.prototype.forEach.call(this.inputs.interpolation, function(input) {

                if (options.interpolation) {
                    input.disabled = false;
                    input.parentNode.classList.remove('disabled');
                } else {
                    input.disabled = true;
                    input.parentNode.classList.add('disabled');
                }
            });

            Array.prototype.forEach.call(this.inputs.offset, function(input) {

                if (options.offset.filter(function(o) {
                        return o == input.value
                    }).length) {
                    input.disabled = false;
                    input.parentNode.classList.remove('disabled');

                } else {
                    input.disabled = true;
                    input.parentNode.classList.add('disabled');
                }

            }.bind(this));

        };

        this.setDefaultOffset = function(renderer) {

            var options = this.rendererOptions[renderer];

            if (options.defaults && options.defaults.offset) {

                Array.prototype.forEach.call(this.inputs.offset, function(input) {
                    if (input.value == options.defaults.offset) {
                        input.checked = true;
                    } else {
                        input.checked = false;
                    }

                }.bind(this));
            }
        };

        this.rendererOptions = {

            area: {
                interpolation: true,
                offset: ['zero', 'wiggle', 'expand', 'value'],
                defaults: {
                    offset: 'zero'
                }
            },
            line: {
                interpolation: true,
                offset: ['expand', 'value'],
                defaults: {
                    offset: 'value'
                }
            },
            bar: {
                interpolation: false,
                offset: ['zero', 'wiggle', 'expand', 'value'],
                defaults: {
                    offset: 'zero'
                }
            },
            scatterplot: {
                interpolation: false,
                offset: ['value'],
                defaults: {
                    offset: 'value'
                }
            }
        };

        this.initialize();
    };

    // set up our data series with 150 random data points

    var seriesData = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ];
    var random = new Rickshaw.Fixtures.RandomData(150);

    for (var i = 0; i < 150; i++) {
        random.addData(seriesData);
    }

    // default colors
    var palette = new Rickshaw.Color.Palette({
        scheme: 'e360'
    });



    // instantiate our graph!

    //TODO:310 use graph-button click event to build seriesData array for each series from source posts, then insert into series object instead of the random numbers that are there now

    var graph = new Rickshaw.Graph({
        element: document.getElementById("chart"),
        width: 900,
        height: 500,
        renderer: 'area',
        stroke: true,
        preserve: true,
        series: [{
            color: palette.color(),
            data: seriesData[0],
            name: 'TotalTrafficDC'
        }, {
            color: palette.color(),
            data: seriesData[1],
            name: 'ggwash'
        }, {
            color: palette.color(),
            data: seriesData[2],
            name: 'myLHBS'
        }, {
            color: palette.color(),
            data: seriesData[3],
            name: 'Arkady_Gluhih '
        }, {
            color: palette.color(),
            data: seriesData[4],
            name: 'hawkoviim '
        }, {
            color: palette.color(),
            data: seriesData[5],
            name: 'stpillow '
        }, {
            color: palette.color(),
            data: seriesData[6],
            name: 'Dina_Maron '
        }]
    });

    graph.render();

    var preview = new Rickshaw.Graph.RangeSlider.Preview({
        graph: graph,
        element: document.getElementById('preview'),
    });

    var hoverDetail = new Rickshaw.Graph.HoverDetail({
        graph: graph,
        xFormatter: function(x) {
            return new Date(x * 1000).toString();
        }
    });

    var annotator = new Rickshaw.Graph.Annotate({
        graph: graph,
        element: document.getElementById('timeline')
    });

    var legend = new Rickshaw.Graph.Legend({
        graph: graph,
        element: document.getElementById('legend')

    });

    var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
        graph: graph,
        legend: legend
    });

    var order = new Rickshaw.Graph.Behavior.Series.Order({
        graph: graph,
        legend: legend
    });

    var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
        graph: graph,
        legend: legend
    });

    var smoother = new Rickshaw.Graph.Smoother({
        graph: graph,
        element: document.querySelector('#smoother')
    });

    var ticksTreatment = 'glow';

    var xAxis = new Rickshaw.Graph.Axis.Time({
        graph: graph,
        ticksTreatment: ticksTreatment,
        timeFixture: new Rickshaw.Fixtures.Time.Local()
    });

    xAxis.render();

    var yAxis = new Rickshaw.Graph.Axis.Y({
        graph: graph,
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        ticksTreatment: ticksTreatment
    });

    yAxis.render();


    var controls = new RenderControls({
        element: document.querySelector('form'),
        graph: graph
    });

    // add some data every so often

    var messages = [
        "Changed home page welcome message",
        "Minified JS and CSS",
        "Changed button color from blue to green",
        "Refactored SQL query to use indexed columns",
        "Added additional logging for debugging",
        "Fixed typo",
        "Rewrite conditional logic for clarity",
        "Added documentation for new methods"
    ];

    setInterval(function() {
        random.removeData(seriesData);
        random.addData(seriesData);
        graph.update();

    }, 3000);

    function addAnnotation(force) {
        if (messages.length > 0 && (force || Math.random() >= 0.95)) {
            annotator.add(seriesData[2][seriesData[2].length - 1].x, messages.shift());
            annotator.update();
        }
    }

    addAnnotation(true);
    setTimeout(function() {
        setInterval(addAnnotation, 6000)
    }, 6000);

    var previewXAxis = new Rickshaw.Graph.Axis.Time({
        graph: preview.previews[0],
        timeFixture: new Rickshaw.Fixtures.Time.Local(),
        ticksTreatment: ticksTreatment
    });

    previewXAxis.render();

}

Template.sources.helpers({

    inputAttributes: () => {
        return {
            placeholder: 'Search...',
            type: 'text',
        }
    },

    loadMoreAttributes: () => {
        return {
            class: 'btn btn-link load-more-button',
        }
    },
    loadMoreIcon: () => '<i class="fa fa-chevron-down" aria-hidden="true"></i>',

    sourcesIndex: () => SourcesIndex,

    'listSources': function() {
        var currentUserId = Meteor.userId();
        return Sources.find({}, {
            sort: {
                "levelOfConfidence.locValue": -1,
                sourcePostCount: -1
            }
        })
    },
    'postsBySource': function() {
        return Posts.find({
            author: this.author
        }, {
            sort: {
                submitted: -1
            }
        });
    },

    'showSelectedSource': function() {
        var currentUserId = Meteor.userId();
        var selectedSource = Session.get('selectedSource');

        return Sources.findOne({
            _id: selectedSource
        });
    },
    'showSelectedPosts': function() {
        var currentUserId = Meteor.userId();
        var selectedSource = Session.get('selectedSource');
        var selectedName = Session.get('selectedName');
        var selectedType = Session.get('selectedType');
        return Posts.find({
            author: selectedName,
            type: selectedType
        }, {
            sort: {
                created: -1
            }
        });
    },
    'postCount': function() {
        return Posts.find({
            author: this.author
        }).count();
    },
    'showGraph': function() {
        if (Session.get('graphClicked') === true) {
            return 'visible'
        } else return 'hidden'


    },
    'sourceID': function() {
        return this.author
    },
    'sourceLocColor': function() {
        if (this.levelOfConfidence.locValue > 0 && this.levelOfConfidence.locValue <= 10) {
            return 'notice-level-1';
        } else if (this.levelOfConfidence.locValue > 10 && this.levelOfConfidence.locValue <= 19) {
            return 'notice-level-2';
        } else if (this.levelOfConfidence.locValue > 19 && this.levelOfConfidence.locValue <= 29) {
            return 'notice-level-3';
        } else if (this.levelOfConfidence.locValue > 29 && this.levelOfConfidence.locValue <= 39) {
            return 'notice-level-4';
        } else if (this.levelOfConfidence.locValue > 39 && this.levelOfConfidence.locValue <= 49) {
            return 'notice-level-5';
        } else if (this.levelOfConfidence.locValue > 49 && this.levelOfConfidence.locValue <= 59) {
            return 'notice-level-6';
        } else if (this.levelOfConfidence.locValue > 59 && this.levelOfConfidence.locValue <= 69) {
            return 'notice-level-7';
        } else if (this.levelOfConfidence.locValue > 69 && this.levelOfConfidence.locValue <= 79) {
            return 'notice-level-8';
        } else if (this.levelOfConfidence.locValue > 79 && this.levelOfConfidence.locValue <= 89) {
            return 'notice-level-9';
        } else if (this.levelOfConfidence.locValue > 89 && this.levelOfConfidence.locValue <= 100) {
            return 'notice-level-10';
        } else {
            return 'notice';
        }
    },
    'postVerColor': function() {
        if (this.verificationScore > 0 && this.verificationScore <= 10) {
            return 'verification-source-1';
        } else if (this.verificationScore > 10 && this.verificationScore <= 19) {
            return 'verification-source-2';
        } else if (this.verificationScore > 19 && this.verificationScore <= 29) {
            return 'verification-source-3';
        } else if (this.verificationScore > 29 && this.verificationScore <= 39) {
            return 'verification-source-4';
        } else if (this.verificationScore > 39 && this.verificationScore <= 49) {
            return 'verification-source-5';
        } else if (this.verificationScore > 49 && this.verificationScore <= 59) {
            return 'verification-source-6';
        } else if (this.verificationScore > 59 && this.verificationScore <= 69) {
            return 'verification-source-7';
        } else if (this.verificationScore > 69 && this.verificationScore <= 79) {
            return 'verification-source-8';
        } else if (this.verificationScore > 79 && this.verificationScore <= 89) {
            return 'verification-source-9';
        } else if (this.verificationScore > 89 && this.verificationScore <= 100) {
            return 'verification-source-10';
        } else {
            return 'unverified-source';
        }
    },
    'sourceType': function() {
        var typeId = this.type;
        //console.log('typeId')
        if (typeId === 'RSS') {
            return "fa-rss"
        } else if (typeId === 'twitter') {
            return "fa-twitter"
        } else {
            return "fa-instagram"
        }
    },
    'getSourceType': function() {
        //var userIcon = this.type;
        var userIcon = Session.get('selectedType');
        console.log('typeId')
        if (userIcon === 'RSS') {
            return "fa-rss"
        } else if (userIcon === 'twitter') {
            return "fa-twitter"
        } else {
            return "fa-instagram"
        }
    }
});

Template.sources.events({
    'click .sorting': (e) => {
        SourcesIndex.getComponentMethods()
            .addProps('sortBy', $(e.target).val())
        // 'change .sorting': (e) => {
        //   SourcesIndex.getComponentMethods()
        //     .addProps('sortBy', $(e.target).val())
    },
    'click .source': function() {
        var sourceId = this.__originalId;
        var sourceName = this.author;
        var sourceType = this.type;
        console.log('click');
        console.log(sourceName);
        console.log(sourceId);
        console.log(sourceType);

        Session.set('selectedSource', sourceId);
        Session.set('selectedName', sourceName);
        Session.set('selectedType', sourceType);
    },
    'click .graph-button': function() {
        //var graphClicked = True;
        Session.set('graphClicked', true);
    }
})
