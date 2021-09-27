import React, { useEffect, useRef } from 'react'

import './Map.css'

const Map = (props) => {
    const mapRef = useRef()
    const { center, zoom } = props

    // useEffect runs after the JSX has been rendered so mapRef is defined
    useEffect(() => {
        const map = new window.google.maps.Map(mapRef.current, {
            center: center,
            zoom: zoom
        })

        new window.google.maps.Marker({ position: center, map: map })
    }, [center, zoom])

    return (
        <div
            ref={mapRef}
            className={`map ${props.className}`}
            style={props.style}
        ></div>
    )
}

export default Map
