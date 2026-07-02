import { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  CircularProgress,
  Box,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chartData, setChartData] = useState(null);

  // Get userinfo
  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/api/auth/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {      
      setUser(res.data.user);
    })
    .catch(err => {
      console.error('Error fetching user info:', err);
    });
  }, []);

  // Fetch top coins
  useEffect(() => {
    axios
      .get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 10,
            page: 1,
            sparkline: false,
          },
        }
      )
      .then((response) => {
        setCoins(response.data);
        setLoading(false);
      })
      .catch((error) => console.error('Error fetching coins:', error));
  }, []);

  // Fetch chart data for selected coin
  const fetchChartData = (coinId) => {
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
        {
          params: {
            vs_currency: 'usd',
            days: 30,
          },
        }
      )
      .then((response) => {
        const prices = response.data.prices;
        const labels = prices.map((p) => new Date(p[0]).toLocaleDateString());
        const dataPoints = prices.map((p) => p[1]);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Price in USD',
              data: dataPoints,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.4,
            },
          ],
        });
      })
      .catch((error) => console.error('Error fetching chart data:', error));
  };

  const handleCoinClick = (coin) => {
    setSelectedCoin(coin);
    fetchChartData(coin.id);
  };

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) return <div>Loading...</div>;

  return (
    <Container  maxWidth="xl" sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Crypto Dashboard
      </Typography>
      <p>Welcome, {user.userName}</p>
      <TextField
        label="Search Cryptocurrency"
        variant="outlined"
        fullWidth
        onChange={(e) => setSearch(e.target.value)}
        sx={{ marginBottom: 4 }}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {filteredCoins.map((coin) => (
              <Grid item xs={12} sm={6} md={4} key={coin.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    '&:hover': { boxShadow: 6 },
                  }}
                  onClick={() => handleCoinClick(coin)}
                >
                  <CardContent>
                    <Typography variant="h6">{coin.name}</Typography>
                    <Typography variant="subtitle1">
                      ${coin.current_price.toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={
                        coin.price_change_percentage_24h >= 0 ? 'green' : 'red'
                      }
                    >
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {selectedCoin && chartData && (
            <Box sx={{ marginTop: 4 }}>
              <Typography variant="h5" gutterBottom>
                {selectedCoin.name} Price Chart - Last 30 Days
              </Typography>
              <Line data={chartData} />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

export default Dashboard;