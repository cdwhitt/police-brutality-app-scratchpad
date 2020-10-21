import React, { useState, useEffect } from "react"
import _ from "lodash"
import "./App.css"
import { Segment, Dropdown, Button, Card, List, Label } from "semantic-ui-react"
import axios from "axios"
import * as statesJSON from "./states.json"
const states = Object.values(statesJSON.default)

const stateOptions = _.map(states, (state, index) => ({
	key: states[index],
	text: state,
	value: states[index],
}))

const App = () => {
	const [stateQuery, setStateQuery] = useState("")
	const [results, setResults] = useState([])
	const fetchStateData = async () => {
		const { data } = await axios.get(
			`https://api.846policebrutality.com/api/incidents?&filter[state]=${stateQuery}`
		)

		setResults(data.data)
	}

	const fetchByTag = async (tag) => {
		const { data } = await axios.get(
			`https://api.846policebrutality.com/api/incidents?filter[tags]=${tag}`
		)

		setResults(data.data)
	}

	const incidentCards = results.map(
		({
			city,
			data,
			date,
			description,
			geocoding,
			id,
			links,
			pb_id,
			state,
			tags,
			title,
		}) => (
			<Card>
				<Card.Content>
					<Card.Header>{title}</Card.Header>
					<Card.Meta>Location: {city}</Card.Meta>
					<Card.Description>
						Links:
						{links.map((link) => (
							<List>
								<List.Item>
									<a href={link}>{link.substring(0, 30)}...</a>
								</List.Item>
							</List>
						))}
						Tags:
						{tags.map((tag) => (
							<List>
								<List.Item>
									<Label as="a" onClick={() => fetchByTag(tag)}>
										#{tag}
									</Label>
								</List.Item>
							</List>
						))}
					</Card.Description>
				</Card.Content>
			</Card>
		)
	)

	//city: //String
	//data: //??
	//date: //Date String
	//description: //String?
	//geocoding: // Object w/ lat: & long:
	//id: //String
	//links: //Array of strings
	//pb_id: //String
	//state: //String
	//tags: //Array of strings
	//title: //String

	return (
		<>
			<Segment>
				<Dropdown
					value={stateQuery}
					placeholder="State"
					search
					selection
					options={stateOptions}
					onChange={(event) => setStateQuery(event.target.textContent)}
				/>
				<Button icon="search" color="green" onClick={fetchStateData}></Button>
			</Segment>
			<Card.Group>{incidentCards}</Card.Group>
		</>
	)
}

export default App
