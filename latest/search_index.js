var documenterSearchIndex = {"docs": [

{
    "location": "index.html#",
    "page": "Home",
    "title": "Home",
    "category": "page",
    "text": ""
},

{
    "location": "index.html#Dubins.jl-Documentation-1",
    "page": "Home",
    "title": "Dubins.jl Documentation",
    "category": "section",
    "text": "CurrentModule = Dubins"
},

{
    "location": "index.html#Overview-1",
    "page": "Home",
    "title": "Overview",
    "category": "section",
    "text": "Dubins.jl is a Julia package for computing the shortest path between two configurations for the Dubins\' vehicle (see Dubins, 1957). The shortest path algorithm, implemented in this package, uses the algebraic solution approach in the paper \"Classification of the Dubins set\" by Andrei M. Shkel and Vladimir Lumelsky."
},

{
    "location": "index.html#Installation-1",
    "page": "Home",
    "title": "Installation",
    "category": "section",
    "text": "The latest release of Dubins can be installed using the Julia package manager withPkg.add(\"Dubins\")Test that the package works by running Pkg.test(\"Dubins\")"
},

{
    "location": "api.html#",
    "page": "API Documentation",
    "title": "API Documentation",
    "category": "page",
    "text": ""
},

{
    "location": "api.html#API-Documentation-and-Usage-1",
    "page": "API Documentation",
    "title": "API Documentation and Usage",
    "category": "section",
    "text": "Once the Dubins package is installed it can be imported using the commandusing DubinsThe methods that can be used without the qualifier Dubins. includedubins_shortest_path, dubins_path,\ndubins_path_length, dubins_segment_length,\ndubins_segment_length_normalized,\ndubins_path_type, dubins_path_sample,\ndubins_path_sample_many, dubins_path_endpoint,\ndubins_extract_subpathThe constants and other variables that can be used without the qualifier Dubins. includeDubinsPathType, SegmentType, DubinsPath,\nLSL, LSR, RSL, RSR, RLR, LRL,\nEDUBOK, EDUBCOCONFIGS, EDUBPARAM,\nEDUBBADRHO, EDUBNOPATH, EDUBBADINPUTAny method in the Dubins package would return an error code. The error codes that are defined within the package areconst EDUBOK = 0                # no error\nconst EDUBCOCONFIGS = 1         # colocated configurations\nconst EDUBPARAM = 2             # path parameterization error\nconst EDUBBADRHO = 3            # the rho value is invalid\nconst EDUBNOPATH = 4            # no connection between configurations with this word\nconst EDUBBADINPUT = 5          # uninitialized inputs to functions"
},

{
    "location": "api.html#Dubins-paths/shortest-Dubins-path-1",
    "page": "API Documentation",
    "title": "Dubins paths/shortest Dubins path",
    "category": "section",
    "text": "Any call to the methods within the Dubins package begins by initializing a DubinsPath usingpath = DubinsPath()The shortest path between two configurations is computed using the method dubins_shortest_path() aserrcode = dubins_shortest_path(path, [0., 0., 0.], [1., 0., 0.], 1.)Here, path is an object of type DubinsPath, [0., 0., 0.] is the initial configuration, [1., 0., 0.] is the final configuration and 1. is the turn radius of the Dubins vehicle. A configuration is a 3-element vector with the x-coordinate, y-coordinate, and the heading angle. The above code would return a non-zero error code in case of any errors.A Dubins path of a specific type can be computed usingerrcode = dubins_path(path, zeros(3), [10., 0., 0.], 1., RSL)where, the last argument is the type of Dubins path; it can take any value in LSL, LSR, RSL, RSR, RLR, LRL.The length of a Dubins path is computed after a function call to dubins_shortest_path() or dubins_path() asval = dubins_path_length(path)The length of each segment (1-3) in a Dubins path and the type of Dubins path can be queried usingval1 = dubins_segment_length(path, 1)\nval2 = dubins_segment_length(path, 2)\nval3 = dubins_segment_length(path, 3)\npath_type = dubins_path_type(path)The second argument in the method dubins_segment_length() is the segment number. If a segment number that is less than 1 or greater than 3 is used, the method will return Inf."
},

{
    "location": "api.html#Sub-path-extraction-1",
    "page": "API Documentation",
    "title": "Sub-path extraction",
    "category": "section",
    "text": "A sub-path of a given Dubins path can be extracted aspath = DubinsPath()\nerrcode = dubins_path(path, zeros(3), [4., 0., 0.], 1., LSL)\n\nsubpath = DubinsPath()\nerrcode = dubins_extract_subpath(path, 2., subpath)The second argument of the function dubins_extract_subpath() is a parameter that has lie in the open interval (0,dubins_path_length(path)), failing which the function will return a EDUBPARAM error-code.  After extracting a sub-path, the end-point of the sub-path can be queried using the method dubins_path_endpoint(subpath, q), where q = Vector{Float64}(3). This function returns EDUBOK on successful completion."
},

{
    "location": "api.html#Sampling-a-Dubins-path-1",
    "page": "API Documentation",
    "title": "Sampling a Dubins path",
    "category": "section",
    "text": "Sampling the configurations along a Dubins path is a useful feature that can aid in writing additional plotting features. To that end, the package includes two functions that can achieve the same goal of sampling in two different ways; they are dubins_path_sample() and dubins_path_sample_many(). The usage of the method dubins_path_sample() is illustrated by the following code snippet:path = DubinsPath()\nerrcode = dubins_path(path, [0., 0., 0.], [4., 0., 0.], 1., LSL)\n\nqsamp = Vector{Float64}(3)\nerrcode = dubins_path_sample(path, 0., qsamp)\n# qsamp will take a value [0., 0., 0.], which is the initial configuration\n\nqsamp = Vector{Float64}(3)\nerrcode = dubins_path_sample(path, 4., qsamp)\n# qsamp will take a value [4., 0., 0.], which is the final configuration\n\nqsamp = Vector{Float64}(3)\nerrcode = dubins_path_sample(path, 2., qsamp)\n# qsamp will take a value [2., 0., 0.], the configuration of the vehicle after travelling for 2 unitsThe second argument of the function dubins_path_sample() is a parameter that has lie in the open interval (0,dubins_path_length(path)), failing which the function will return a EDUBPARAM error-code.  As one can observe from the above code snippet, dubins_path_sample() samples the Dubins path only once. Sampling an entire Dubins path using a step size, can be achieved using the method dubins_path_sample_many(). The dubins_path_sample_many() takes in three arguments:the Dubins path that needs to be sampled,\nthe step size denoting the distance along the path for subsequent samples, and\na callback function that takes in a configuration, a float, and other keyword arguments to do some operation (like print) with the samples; the callback function should always return a 0 when it has completed its operation.The following code snippet samples a Dubins path using a step size and prints the configuration at each sample:function callback_fcn(q::Vector{Float64}, x::Float64; kwargs...)\n    println(\"x: $(q[1]), y: $(q[2]), Θ: $(q[3])\")\n    return 0\nend\n\npath = DubinsPath()\nerrcode = dubins_path(path, [0., 0., 0.], [4., 0., 0.], 1., LSL)\nerrcode = dubins_path_sample_many(path, 1., callback_fcn)The output of the above code snippet isx: 0.0, y: 0.0, Θ: 0.0\nx: 1.0, y: 0.0, Θ: 0.0\nx: 2.0, y: 0.0, Θ: 0.0\nx: 3.0, y: 0.0, Θ: 0.0The same behaviour can also be achieved by using the dubins_path_sample() multiple times, one for each step."
},

{
    "location": "library.html#",
    "page": "Library",
    "title": "Library",
    "category": "page",
    "text": ""
},

{
    "location": "library.html#Dubins.DubinsPath",
    "page": "Library",
    "title": "Dubins.DubinsPath",
    "category": "type",
    "text": "The data structure that holds the full dubins path.\n\nIts data fields are as follows:\n\nthe initial configuration, qi,\nthe params vector that contains the length of each segment, params,\nthe turn-radius, ρ, and,\nthe Dubins path type given by the @enum DubinsPathType\n\n\n\n"
},

{
    "location": "library.html#Dubins.DubinsPath-Tuple{}",
    "page": "Library",
    "title": "Dubins.DubinsPath",
    "category": "method",
    "text": "Empty constructor for the DubinsPath type\n\n\n\n"
},

{
    "location": "library.html#Dubins.dubins_extract_subpath-Tuple{Dubins.DubinsPath,Float64,Dubins.DubinsPath}",
    "page": "Library",
    "title": "Dubins.dubins_extract_subpath",
    "category": "method",
    "text": "Convenience function to extract a sub-path\n\npath          - an initialized path\nt             - a length measure, where 0 < t < dubins_path_length(path)\nnewpath       - the resultant path\nreturn        - zero on successful completion\n\n\n\n"
},

{
    "location": "library.html#Dubins.dubins_path-Tuple{Dubins.DubinsPath,Array{Float64,1},Array{Float64,1},Float64,Dubins.DubinsPathType}",
    "page": "Library",
    "title": "Dubins.dubins_path",
    "category": "method",
    "text": "Generate a path with a specified word from an initial configuratioon to a target configuration, with a specified turning radius\n\npath      - resultant path\nq0        - a configuration specified by a 3-element vector x, y, theta\nq1        - a configuration specified by a 3-element vector x, y, theta\nrho       - turning radius of the vehicle\npath_type - the specified path type to use\nreturn    - error code\n\n\n\n"
},

{
    "location": "library.html#Dubins.dubins_path_endpoint-Tuple{Dubins.DubinsPath,Array{Float64,1}}",
    "page": "Library",
    "title": "Dubins.dubins_path_endpoint",
    "category": "method",
    "text": "Convenience function to identify the endpoint of a path\n\npath          - an initialized path\nq             - the end point\nreturn        - zero on successful completion\n\n\n\n"
},

{
    "location": "library.html#Dubins.dubins_path_length-Tuple{Dubins.DubinsPath}",
    "page": "Library",
    "title": "Dubins.dubins_path_length",
    "category": "method",
    "text": "Calculate the length of an initialized path\n\npath      - path to find the length of\nreturn    - path length\n\n\n\n"
},

{
    "location": "library.html#Dubins.dubins_path_sample-Tuple{Dubins.DubinsPath,Float64,Array{Float64,1}}",
    "page": "Library",
    "title": "Dubins.dubins_path_sample",
    "category": "method",
    "text": "Calculate the configuration along the path, using the parameter t\n\npath      - an initialized path\nt         - length measure where 0 <= t < dubins_path_length(path)\nq         - the configuration result [x, y, θ]\nreturn    - non-zero error code if \'t\' is not in the correct range\n\n\n\n"
},

{
    "location": "library.html#Dubins.dubins_path_sample_many-Tuple{Dubins.DubinsPath,Float64,Any}",
    "page": "Library",
    "title": "Dubins.dubins_path_sample_many",
    "category": "method",
    "text": "Walk along the path at a fixed sampling interval, calling the callback function at each interval\n\nThe sampling process continues until the whole path is sampled, or the callback returns a non-zero value\n\npath         - the path to sample\nstep_size    - the distance along the path for subsequent samples\ncb           - the callback function to call for each sample\nreturn       - error code\n\n\n\n\n\n"
},

{
    "location": "library.html#Dubins.dubins_path_type-Tuple{Dubins.DubinsPath}",
    "page": "Library",
    "title": "Dubins.dubins_path_type",
    "category": "method",
    "text": "Extract the integer that represents which path type was used\n\npath      - an initialized path\nreturn    - one of LSL-0, LSR-1, RSL-2, RSR-3, RLR-4, LRL-5\n\n\n\n"
},

{
    "location": "library.html#Dubins.dubins_segment_length-Tuple{Dubins.DubinsPath,Int64}",
    "page": "Library",
    "title": "Dubins.dubins_segment_length",
    "category": "method",
    "text": "Calculate the length of a specific segment of  an initialized path\n\npath      - path to find the length of\ni         - the segment for which the length is required (1-3)\nreturn    - segment length\n\n\n\n"
},

{
    "location": "library.html#Dubins.dubins_segment_length_normalized-Tuple{Dubins.DubinsPath,Int64}",
    "page": "Library",
    "title": "Dubins.dubins_segment_length_normalized",
    "category": "method",
    "text": "Calculate the normalized length of a specific segment of  an initialized path\n\npath      - path to find the length of\ni         - the segment for which the length is required (1-3)\nreturn    - normalized segment length\n\n\n\n"
},

{
    "location": "library.html#Dubins.dubins_shortest_path-Tuple{Dubins.DubinsPath,Array{Float64,1},Array{Float64,1},Float64}",
    "page": "Library",
    "title": "Dubins.dubins_shortest_path",
    "category": "method",
    "text": "Generate a path from an initial configuration to a target configuration with a specified maximum turning radius\n\nA configuration is given by [x, y, θ], where θ is in radians,\n\npath      - resultant path\nq0        - a configuration specified by a 3-element vector [x, y, θ]\nq1        - a configuration specified by a 3-element vector [x, y, θ]\nrho       - turning radius of the vehicle\nreturn    - error code\n\n\n\n"
},

{
    "location": "library.html#Dubins.DubinsIntermediateResults",
    "page": "Library",
    "title": "Dubins.DubinsIntermediateResults",
    "category": "type",
    "text": "This data structure holds the information to compute the Dubins path in the transformed coordinates where the initial (x,y) is translated to the origin, the final the coordinate axis is rotated to make the x-axis aligned with the line joining the two points. The variable names follow the convention used in the paper \"Classification of the Dubins set\" by Andrei M. Shkel and Vladimir Lumelsky\n\n\n\n"
},

{
    "location": "library.html#Dubins.DubinsIntermediateResults-Tuple{Array{Float64,1},Array{Float64,1},Float64}",
    "page": "Library",
    "title": "Dubins.DubinsIntermediateResults",
    "category": "method",
    "text": "Empty constructor for the DubinsIntermediateResults data type\n\n\n\n"
},

{
    "location": "library.html#Dubins.dubins_segment-Tuple{Float64,Array{Float64,1},Array{Float64,1},Dubins.SegmentType}",
    "page": "Library",
    "title": "Dubins.dubins_segment",
    "category": "method",
    "text": "Operators that transform an arbitrary point qi, [x, y, θ], into an image point.\n\nThe three operators correspond to L_SEG, R_SEG, and S_SEG\n\nL_SEG(x, y, θ, t) = [x, y, θ] + [ sin(θ + t) - sin(θ), -cos(θ + t) + cos(θ),  t]\nR_SEG(x, y, θ, t) = [x, y, θ] + [-sin(θ - t) + sin(θ),  cos(θ - t) - cos(θ), -t]\nS_SEG(x, y, θ, t) = [x, y, θ] + [ cos(θ) * t,           sin(θ) * t,           0]\n\n\n\n"
},

{
    "location": "library.html#Dubins.dubins_word-Tuple{Dubins.DubinsIntermediateResults,Dubins.DubinsPathType,Array{Float64,1}}",
    "page": "Library",
    "title": "Dubins.dubins_word",
    "category": "method",
    "text": "The function to call the corresponding Dubins path based on the path_type\n\nreturn        - error code; zero on successful completion\n\n\n\n"
},

{
    "location": "library.html#Dubins.set_tolerance-Tuple{Float64}",
    "page": "Library",
    "title": "Dubins.set_tolerance",
    "category": "method",
    "text": "Reset tolerance value\n\n\n\n"
},

{
    "location": "library.html#Dubins.jl-Library-1",
    "page": "Library",
    "title": "Dubins.jl Library",
    "category": "section",
    "text": "Modules = [Dubins]"
},

]}
