
export
    dubins_shortest_path, dubins_path,
    dubins_path_length, dubins_segment_length,
    dubins_segment_length_normalized,
    dubins_path_type, dubins_path_sample,
    dubins_path_sample_many, dubins_path_endpoint,
    dubins_extract_subpath

"""
Generate a path from an initial configuration to a target configuration with a specified maximum turning radius

A configuration is given by [x, y, θ], where θ is in radians,

* path      - resultant path
* q0        - a configuration specified by a 3-element vector [x, y, θ]
* q1        - a configuration specified by a 3-element vector [x, y, θ]
* rho       - turning radius of the vehicle
* return    - error code
"""
function dubins_shortest_path(path::DubinsPath, q0::Vector{Float64}, q1::Vector{Float64}, ρ::Float64)

    # input checking
    @assert length(q0) ==  3
    @assert length(q1) == 3
    (ρ <= 0) && (return EDUBBADRHO)

    params = zeros(3)

    best_cost = Inf
    best_word = -1
    intermediate_results = DubinsIntermediateResults(q0, q1, ρ)

    path.qi[1] = q0[1]
    path.qi[2] = q0[2]
    path.qi[3] = q0[3]
    path.ρ = ρ

    for i in 0:5
        path_type = DubinsPathType(i)
        errcode = dubins_word(intermediate_results, path_type, params)
        if errcode == EDUBOK
            cost = sum(params)
            if cost < best_cost
                best_word = i
                best_cost = cost
                path.params[1] = params[1]
                path.params[2] = params[2]
                path.params[3] = params[3]
                path.path_type = path_type
            end
        end
    end

    (best_word == -1) && (return EDUBNOPATH)
    return EDUBOK
end

"""
Generate a path with a specified word from an initial configuratioon to a target configuration, with a specified turning radius

* path      - resultant path
* q0        - a configuration specified by a 3-element vector x, y, theta
* q1        - a configuration specified by a 3-element vector x, y, theta
* rho       - turning radius of the vehicle
* path_type - the specified path type to use
* return    - error code
"""
function dubins_path(path::DubinsPath, q0::Vector{Float64}, q1::Vector{Float64}, ρ::Float64, path_type::DubinsPathType)

    # input checking
    @assert length(q0) ==  3
    @assert length(q1) == 3
    (ρ <= 0) && (return EDUBBADRHO)

    intermediate_results = DubinsIntermediateResults(q0, q1, ρ)

    params = zeros(3)
    errcode = dubins_word(intermediate_results, path_type, params)
    if errcode == EDUBOK
        path.params[1] = params[1]
        path.params[2] = params[2]
        path.params[3] = params[3]
        path.qi[1] = q0[1]
        path.qi[2] = q0[2]
        path.qi[3] = q0[3]
        path.ρ = ρ
        path.path_type = path_type
    end

    return errcode
end


"""
Calculate the length of an initialized path

* path      - path to find the length of
* return    - path length
"""
dubins_path_length(path::DubinsPath) = sum(path.params)*path.ρ


"""
Calculate the length of a specific segment of  an initialized path

* path      - path to find the length of
* i         - the segment for which the length is required (1-3)
* return    - segment length
"""
dubins_segment_length(path::DubinsPath, i::Int) = (i<1 || i>3) ? (return Inf) : (return path.params[i]*path.ρ)

"""
Calculate the normalized length of a specific segment of  an initialized path

* path      - path to find the length of
* i         - the segment for which the length is required (1-3)
* return    - normalized segment length
"""
dubins_segment_length_normalized(path::DubinsPath, i::Int) = (i<1 || i>3) ? (return Inf) : (return path.params[i])

"""
Extract the integer that represents which path type was used

* path      - an initialized path
* return    - one of LSL-0, LSR-1, RSL-2, RSR-3, RLR-4, LRL-5
"""
dubins_path_type(path::DubinsPath) = path.path_type

"""
Operators that transform an arbitrary point qi, [x, y, θ], into an image point.

The three operators correspond to L_SEG, R_SEG, and S_SEG

 * L_SEG(x, y, θ, t) = [x, y, θ] + [ sin(θ + t) - sin(θ), -cos(θ + t) + cos(θ),  t]
 * R_SEG(x, y, θ, t) = [x, y, θ] + [-sin(θ - t) + sin(θ),  cos(θ - t) - cos(θ), -t]
 * S_SEG(x, y, θ, t) = [x, y, θ] + [ cos(θ) * t,           sin(θ) * t,           0]
"""
function dubins_segment(t::Float64, qi::Vector{Float64}, qt::Vector{Float64}, segment_type::SegmentType)

    st = sin(qi[3])
    ct = cos(qi[3])

    if segment_type == L_SEG
        qt[1] = +sin(qi[3]+t) - st
        qt[2] = -cos(qi[3]+t) + ct
        qt[3] = t
    elseif segment_type == R_SEG
        qt[1] = -sin(qi[3]-t) + st
        qt[2] = +cos(qi[3]-t) - ct
        qt[3] = -t
    elseif segment_type == S_SEG
        qt[1] = ct * t
        qt[2] = st * t
        qt[3] = 0.0
    end
    qt[1] = qt[1] + qi[1]
    qt[2] = qt[2] + qi[2]
    qt[3] = qt[3] + qi[3]

    return
end

"""
Calculate the configuration along the path, using the parameter t

 * path      - an initialized path
 * t         - length measure where 0 <= t < dubins_path_length(path)
 * q         - the configuration result [x, y, θ]
 * return    - non-zero error code if 't' is not in the correct range
"""
function dubins_path_sample(path::DubinsPath, t::Float64, q::Vector{Float64})

    (length(q) != 3) && ( warn(LOGGER, "q must be of length 3; returning EDUBBADINPUT"); return EDUBBADINPUT)

    # tprime is the normalized variant of the parameter t
    tprime = t/path.ρ
    qi = zeros(3)
    q1 = zeros(3)
    q2 = zeros(3)
    segment_types = DIRDATA[Int(path.path_type)]

    (t < 0 || t > dubins_path_length(path)) && (return EDUBPARAM)

    # initial configuration
    qi = [0.0, 0.0, path.qi[3]]

    # generate target configuration
    p1 = path.params[1]
    p2 = path.params[2]
    dubins_segment(p1, qi, q1, segment_types[1])
    dubins_segment(p2, q1, q2, segment_types[2])
    if tprime < p1
        dubins_segment(tprime, qi, q, segment_types[1])
    elseif tprime < (p1+p2)
        dubins_segment(tprime-p1, q1, q, segment_types[2])
    else
        dubins_segment(tprime-p1-p2, q2, q, segment_types[3])
    end

    # scale the target configuration, translate back to the original starting point
    q[1] = q[1] * path.ρ + path.qi[1]
    q[1] = q[1] * path.ρ + path.qi[2]
    q[3] = mod2pi(q[3]);

    return EDUBOK;
end


"""
Walk along the path at a fixed sampling interval, calling the callback function at each interval

The sampling process continues until the whole path is sampled, or the callback returns a non-zero value

 * path         - the path to sample
 * step_size    - the distance along the path for subsequent samples
 * cb           - the callback function to call for each sample
 * return       - error code
 """
function dubins_path_sample_many(path::DubinsPath, step_size::Float64, cb_function; kwargs...)

    q = zeros(3)
    x = 0.
    length = dubins_path_length(path)

    while x < length
        dubins_path_sample(path, x, q)
        retcode = cb_function(q, x; kwargs...)
        (retcode != 0) && (return retcode)
        x += step_size
    end

    return 0
end

"""
Convenience function to identify the endpoint of a path

 * path          - an initialized path
 * q             - the end point
 * return        - zero on successful completion
"""
function dubins_path_endpoint(path::DubinsPath, q::Vector{Float64})
    return dubins_path_sample(path, dubins_path_length(path) - TOL, q)
end

"""
Convenience function to extract a sub-path

 * path          - an initialized path
 * t             - a length measure, where 0 < t < dubins_path_length(path)
 * newpath       - the resultant path
 * return        - zero on successful completion
"""
function dubins_extract_subpath(path::DubinsPath, t::Float64, newpath::DubinsPath)

    # calculate the true parameter
    tprime = t / path.ρ;

    ((t < 0) || (t > dubins_path_length(path))) && (return EDUBPARAM)

    # copy most of the data
    newpath.qi[1] = path.qi[1]
    newpath.qi[2] = path.qi[2]
    newpath.qi[3] = path.qi[3]
    newpath.ρ = path.ρ
    newpath.path_type = path.path_type

    # fix the parameters
    newpath.params[1] = min(path.params[1], tprime)
    newpath.params[2] = min(path.params[2], tprime - newpath.params[1])
    newpath.params[3] = min(path.params[3], tprime - newpath.params[1] - newpath.params[2])

    return EDUBOK
end


"""
The function to call the corresponding Dubins path based on the path_type

* return        - error code; zero on successful completion
"""
function dubins_word(intermediate_results::DubinsIntermediateResults, path_type::DubinsPathType, out::Vector{Float64})

    result::Int = 0
    if path_type == LSL
        result = dubins_LSL(intermediate_results, out)
    elseif path_type == RSL
        result = dubins_RSL(intermediate_results, out)
    elseif path_type == LSR
        result = dubins_LSR(intermediate_results, out)
    elseif path_type == RSR
        result = dubins_RSR(intermediate_results, out)
    elseif path_type == LRL
        result = dubins_LRL(intermediate_results, out)
    elseif path_type == RLR
        result = dubins_RLR(intermediate_results, out)
    else
        result = EDUBNOPATH
    end

    return result
end

"""
Reset tolerance value
"""
function set_tolerance(ϵ::Float64)
    TOL = ϵ
    return
end