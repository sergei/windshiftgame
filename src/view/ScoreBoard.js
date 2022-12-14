import React from "react";

import {List, ListItem, ListItemButton, ListItemText, SvgIcon, Tooltip} from "@mui/material";
import {toHHMMSS} from "../utils/Utils";
import Checkbox from "@mui/material/Checkbox";

function BoatIcon(props) {
    return (
        <SvgIcon sx={{ fontSize: 14 }}  {...props}>
            <path d="M -0.16185357,-60.528489 C -23.351101,0.18972333 -20.565871,43.334463 0.42371743,43.344773 m -0.585571,-103.873262 C 23.027391,0.18972333 21.413303,43.334463 0.42371743,43.344773" />
        </SvgIcon>
    );
}

function ScoreBoard(props) {
    const [checked, setChecked] = React.useState([]);
    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
        props.onOpponentsSelected(newChecked)
    };

    const scoreEntries = props.gameStats.map( (stat,  value) => {
        const labelId = `checkbox-list-secondary-label-${value}`;
        const elapsedTime = toHHMMSS(stat.elapsedTime / 1000);
        const totalDistance = stat.distanceMeters.toFixed(0);
        const upwindTimeMs = toHHMMSS(stat.upwindTimeMs / 1000);
        const upwindDistanceMeters = stat.upwindDistanceMeters.toFixed(0);
        return (
            <ListItem
                key={value}
                secondaryAction={
                    <Tooltip title="If checked this boat will sail with you">
                    <Checkbox
                        edge="end"
                        onChange={handleToggle(value)}
                        checked={checked.indexOf(value) !== -1}
                        inputProps={{ 'aria-labelledby': labelId }}
                    />
                    </Tooltip>
                }
                disablePadding
            >
                <ListItemButton>
                    <BoatIcon  style={{ color: stat.color }} />
                    <ListItemText id={labelId}
                                  primary={`${elapsedTime}\u00A0(${upwindTimeMs}) ${totalDistance}\u00A0m\u00A0(${upwindDistanceMeters}\u00A0m)`}
                    />
                </ListItemButton>
            </ListItem>
        )
    })

    return (
        <div>
            <List component="nav" aria-label="secondary mailbox folder">
                {scoreEntries}
            </List>

        </div>
    )
}
export default ScoreBoard;
