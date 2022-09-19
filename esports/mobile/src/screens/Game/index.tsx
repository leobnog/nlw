import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Background } from '../../components/Background';
import { styles } from './styles';
import {GameParams} from '../../@types/navigation';
import { TouchableOpacity, View, Image, ImageBackground, FlatList, Text } from 'react-native';
import logoImg from '../../assets/logo-nlw-esports.png';
import {Entypo} from '@expo/vector-icons'
import { THEME } from '../../theme';
import { Heading } from '../../components/Heading';
import { DuoCard, DuoCardProps } from '../../components/DuoCard';
import { useEffect, useState } from 'react';
import { DuoMatch } from '../../components/DuoMatch';


export function Game() {
  const [duos, setDuos] = useState<DuoCardProps[]>([])
  const [discordDuoSelected, setDiscordDuoSelected] = useState('')
  const route = useRoute();
  const navigation = useNavigation()
  const game = route.params as GameParams;

  function handleGoBack() {
    navigation.goBack()
  }

  async function getDiscordUser(adsId: string) {
    fetch(`http://192.168.15.2:3333/ads/${adsId}/discord`)
    .then(response => response.json())
    .then(data => setDiscordDuoSelected(data))
  }
  useEffect (() => {
    fetch(`http://192.168.15.2:3333/games/${game.id}/ads`)
    .then(response => response.json())
    .then(data=>setDuos(data))
},[])
  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            
            <Entypo
              name="chevron-thin-left"
              color={THEME.COLORS.CAPTION_300}
            />
          </TouchableOpacity>
          <Image
            source={logoImg}
            style={styles.logo}
          />
        <View style={styles.right} />
        </View>
        <Image
          source={{uri: game.bannerUrl}}
          style={styles.cover}
          // resizeMode="coverz"
        />
        <Heading 
          title={game.title}
          subtitle='Conecte-se e comece o jogo'
        />
        <FlatList 
          data={duos}
          keyExtractor={item => item.id}
          horizontal
          renderItem={({item}) => (
              <DuoCard 
                data={item} 
                onConnect={()=>getDiscordUser(item.id)}
              />
            )
          }
          style={styles.containerList}
          contentContainerStyle={[duos.length > 0 ? styles.contentList : styles.emptyListContent]}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={()=>(
            <Text style={styles.emptyListText}>
              Não há anúncios publicados ainda.
            </Text>
          )}
        />
        <DuoMatch 
          visible={discordDuoSelected.length > 0}
          discord={discordDuoSelected}
          onClose={()=>setDiscordDuoSelected('')}
        />
      </SafeAreaView>
    </Background>
  );
}