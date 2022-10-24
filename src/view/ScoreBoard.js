import React from "react";

import {List, ListItem, ListItemButton, ListItemText, SvgIcon} from "@mui/material";
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
        return (
            <ListItem
                key={value}
                secondaryAction={
                    <Checkbox
                        edge="end"
                        onChange={handleToggle(value)}
                        checked={checked.indexOf(value) !== -1}
                        inputProps={{ 'aria-labelledby': labelId }}
                    />
                }
                disablePadding
            >
                <ListItemButton>
                    <BoatIcon  style={{ color: stat.color }} />
                    <ListItemText id={labelId} primary={`${toHHMMSS(stat.elapsedTime / 1000)} ${stat.distanceMeters.toFixed(0)} m`} />
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
