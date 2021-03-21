const theme = {
  buttonStyles: {
    border: '2px solid #338BFF',
    borderRadius: 5,
    color: '#fff',
    background: '#338BFF',
    padding: [10, 20],
    cursor: 'pointer',
    transition: '.3s ease-in-out background',
    
    '&:hover:not(.disabled)': {
      background: '#1178ff'
    },
    '&:focus:not(.disabled)': {
      border: '2px solid #0051bb',
      outline: 'none'
    }
  },
  error: {
    color: '#f00',
  },
  success: {
    color: '#00a634'
  },
  disabled: {
    background: '#b0c6cd',
    border: '2px solid #b0c6cd',
    cursor: 'not-allowed',

    '&:focus': {
      border: '2px solid #839398',
      outline: 'none'
    }
  }
}

export default theme