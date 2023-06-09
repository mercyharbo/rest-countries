import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Input = styled.input`
  width: 300px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  height: 45px;
  text-indent: 5px;
  font-size: 15px;

  @media (max-width: 768px) {
    width: 100%;
  }
`

const Button = styled.button`
  padding: 0 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  outline: none;
  height: 45px;
  background-color: black;
  color: white;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: blue;
    color: white;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`

const Header = styled.header`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: end;
  justify-content: center;
  padding: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`

const Div = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    width: 100%;
    align-items: flex-start;
  }
`

const Article = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 2px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 10px;
`

const CountryDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const ContinentDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const Wrapper = styled.main`
  width: 70%;
  margin: 0 auto;
  padding: 20px 0;

  @media (max-width: 768px) {
    width: 90%;
  }

  @media (max-width: 320px) {
    width: 100%;
  }
`

const SeeDetailsLink = styled(Link)`
  height: 40px;
  padding: 5px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  color: white;
  text-decoration: none;
  border-radius: 5px;

  &:hover {
    background-color: blue;
    color: white;
  }
`

const Image = styled.img`
  width: 100px;
  height: 70px;
  border-radius: 5px;
`

const SectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Heading = styled.h1`
  font-size: 18px;
`

function Home() {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [displayedCountries, setDisplayedCountries] = useState([])
  const [loadCount, setLoadCount] = useState(10)

  /* This `useEffect` hook is fetching data from an API endpoint using the `fetch` function and setting
  the retrieved data to the `countries` state using the `setCountries` function. The empty array
  `[]` passed as the second argument to the `useEffect` hook ensures that this effect only runs once
  when the component mounts. */
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          'https://restcountries.com/v3.1/all?fields=name,flags,continents'
        )
        const data = await response.json()
        setCountries(data)
      } catch (error) {
        console.error('Error fetching countries:', error)
      }
    }

    fetchCountries()
  }, [])

  /* This `useEffect` hook is filtering the `countries` state based on the `search` term and the
   `loadCount` state. It then updates the `displayedCountries` state with the filtered countries up
   to the `loadCount`. The hook runs whenever there is a change in the `countries`, `search`, or
   `loadCount` state. */
  useEffect(() => {
    const filteredCountries = countries.filter((country) =>
      country.name.common.toLowerCase().includes(search.toLowerCase())
    )

    setDisplayedCountries(filteredCountries.slice(0, loadCount))
  }, [countries, search, loadCount])

  /**
   * The function sets the load count to 10 when handling a search.
   */
  const handleSearch = () => {
    setLoadCount(10)
  }

  /**
   * The function increases the load count by 10 when called.
   */
  const handleLoadMore = () => {
    // Increase the load count by 10
    setLoadCount((prevLoadCount) => prevLoadCount + 10)
  }

  return (
    <Wrapper>
      <Header>
        <Div>
          <span>Keyword</span>
          <Input
            type='text'
            name='search'
            id='search'
            placeholder='Search by keywords'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Div>
        <Button type='button' onClick={handleSearch}>
          Search
        </Button>
      </Header>

      <SectionWrapper>
        {displayedCountries.map((country, index) => {
          return (
            <Article key={index}>
              <CountryDiv>
                <Image src={country?.flags?.png} alt='flags' />
                <h1>{country?.name?.common}</h1>
              </CountryDiv>

              <ContinentDiv>
                <Heading>Continent:</Heading>
                <p>{country?.continents?.[0]}</p>
              </ContinentDiv>
              <SeeDetailsLink to={`/${country.name.common}`}>
                See details
              </SeeDetailsLink>
            </Article>
          )
        })}

        {loadCount < countries.length && (
          <Button type='button' onClick={handleLoadMore}>
            Load More
          </Button>
        )}
      </SectionWrapper>
    </Wrapper>
  )
}

export default Home
