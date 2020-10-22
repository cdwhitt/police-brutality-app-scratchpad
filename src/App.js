import React, { useState, useEffect } from "react"
import _ from "lodash"
import moment from "moment"
import "./App.css"
import { Segment, Dropdown, Button, Card, List, Label } from "semantic-ui-react"
import { ReactTinyLink } from "react-tiny-link"

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
			`https://api.846policebrutality.com/api/incidents?filter[state]=${stateQuery}`
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
			<Card key={id}>
				<Card.Content>
					<Card.Header>{title}</Card.Header>
					<Card.Meta>Date: {date}</Card.Meta>
					<Card.Meta>Location: {city}</Card.Meta>
					<Card.Description>
						Links:
						{links &&
							links.map((link, index) => (
								<List key={index}>
									<List.Item>
										{link.substring(0, 3).includes("http") && (
											<ReactTinyLink
												cardSize="small"
												showGraphic={true}
												maxLine={2}
												minLine={1}
												url={link}
											/>
										)}
									</List.Item>
								</List>
							))}
						Tags:
						{tags.map((tag, index) => (
							<List key={index}>
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
