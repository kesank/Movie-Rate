import React from 'react';
import {StyleSheet,View, Button, TextInput, FlatList, Text} from 'react-native';
import FilmItem from './FilmItem';
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi' ;



class Search extends React.Component {

  constructor(props) {
    super(props)
    this.searchedText = "" // Initialisation de notre donnée searchedText en dehors du state
    this.page = 0 // Compteur pour connaître la page courante
    this.totalPages = 0 // Nombre de pages totales pour savoir si on a atteint la fin des retours de l'API TMDB
    this.state = {
      films: [],
      isLoading: false // Par défaut à false car il n'y a pas de chargement tant qu'on ne lance pas de recherche
    }
  }

  _loadFilms() {
    if (this.searchedText.length > 0) { // Seulement si le texte recherché n'est pas vide
    getFilmsFromApiWithSearchedText(this.searchedText, this.page+1).then(data => {
      this.page = data.page
      this.totalPages = data.total_pages
      this.setState({
        films: [ ...this.state.films, ...data.results ]
      })
    })
  }
  }
  _searchTextInputChanged(text) {
    this.searchedText = text // Modification du texte recherché à chaque saisie de texte, sans passer par le setState comme avant
  }

  _searchFilms() {
  this.page = 0
  this.totalPages = 0
  this.setState({
    films: []
  }, () => { 
    // J'utilise la paramètre length sur mon tableau de films pour vérifier qu'il y a bien 0 film
    console.log("Page : " + this.page + " / TotalPages : " + this.totalPages + " / Nombre de films : " + this.state.films.length)
        // Ici on va remettre à zéro les films de notre state
    this._loadFilms() 
})

}

render() {
  return (
    <View style={styles.main_container}>

    <TextInput
      style={styles.textinput}
      placeholder='Titre du film'
      onChangeText={(text) => this._searchTextInputChanged(text)}
      onSubmitEditing={() => this._searchFilms()}
    />
    <Button title='Rechercher' onPress={() => this._searchFilms()}/>
      <FlatList
        data={this.state.films}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => <FilmItem film={item}/>}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
            if (this.page < this.totalPages) { // On vérifie qu'on n'a pas atteint la fin de la pagination (totalPages) avant de charger plus d'éléments
               this._loadFilms()
            }
        }}/>
      { this.state.isLoading ?
          <View style={styles.loading_container}>
            <ActivityIndicator size='large' />
          </View>
          : null
      }
    </View>
  )
}
}

const styles = StyleSheet.create({
    main_container:{
        marginTop:40,
         flex:1,
          backgroundColor:'white'
    },
    textinput: {
      marginLeft:5,
       marginRight:5,
        height:50,
         borderColor:'red',
          borderWidth:2,
           paddingLeft:5
    },
  });
export default Search