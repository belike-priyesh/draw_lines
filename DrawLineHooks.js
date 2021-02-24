import React, { useState, useCallback } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import Svg, { Circle, Line, Path } from 'react-native-svg'
const THRESHOLD = 10

export default () => {
    const [points, setPoints] = useState([])
    const [isComplete, setComplete] = useState(false)
    const _onTouched = useCallback(({ nativeEvent }) => {
        let x = nativeEvent.locationX
        let y = nativeEvent.locationY
        if (isComplete) {
            return
        }
        if (points.length) {
            let start = points[0]
            console.log("X DIFF>>>>", Math.abs(start.x - x), " Y DIFF:::", Math.abs(start.y - y))
            if (Math.abs(start.x - x) <= THRESHOLD && Math.abs(start.y - y) <= THRESHOLD) {
                setPoints([...points, { ...start, color: _getRandomColor() }])
                setComplete(true)
                return
            }
        }
        console.log('touchMove X', x)
        console.log('touchMove Y', y)
        setPoints([...points, { x, y, color: _getRandomColor() }])
    }, [points])

    const _getRandomColor = useCallback(() => {
        let randomNum1 = Math.floor(Math.random() * 254) + 1
        let randomNum2 = Math.floor(Math.random() * 254) + 1
        let randomNum3 = Math.floor(Math.random() * 254) + 1
        return `rgb(${randomNum1},${randomNum2},${randomNum3})`
    }, [points])

    const _undo = useCallback(() => {
        if (points.length) {
            console.log(">>>>>>>>>POINTS:::", points.slice(points.length - 1))
            setPoints(points.slice(0, -1))
            setComplete(false)
        }
    }, [points])
    return (
        <View style={{ flex: 1 }} >
            <TouchableOpacity onPress={_undo} style={{ alignSelf: "flex-end", padding: 10, margin: 5, backgroundColor: "teal", borderRadius: 200 }}>
                <Text style={{ color: "white" }}>UNDO</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }} onTouchStart={_onTouched} >
                <Svg style={{ flex: 1 }}>
                    {points.map((data, i) => {
                        if (i == 0) {
                            return <Circle key={`${i}`} fill="black" cx={`${data.x}`} cy={`${data.y}`} r={THRESHOLD} />
                        }
                        let prevCords = points[i - 1]
                        return <View key={`${i}`}>
                            <Circle cx={`${data.x}`} fill="black" cy={`${data.y}`} r={THRESHOLD} />
                            <Line x1={`${prevCords.x}`} y1={`${prevCords.y}`} x2={`${data.x}`} y2={`${data.y}`} stroke={data.color} strokeWidth="2" />
                        </View>
                    })}
                </Svg>
            </View>

        </View >
    )
}