const fs = require('fs');

// 1. Patch socketService.js
const f1 = 'd:\\milesgoride\\MGR\\src\\services\\socket.js';
let c1 = fs.readFileSync(f1, 'utf8');
c1 = c1.replace(
    "this.socket.emit('join_user', user.id);",
    "this.socket.emit('user_init', { userId: user.id });"
);
fs.writeFileSync(f1, c1, 'utf8');

// 2. Patch HomeScreen.js to show Car Details
const f2 = 'd:\\milesgoride\\MGR\\src\\screens\\HomeScreen.js';
let c2 = fs.readFileSync(f2, 'utf8');

const oldBlock = <View style={{backgroundColor:'#f9f9f9', padding:15, borderRadius:12, flexDirection:'row', alignItems:'center', marginBottom:15}}>
                        <Image source={{uri: activeRide.driver_photo ? \https://milesgoride.com/uploads/\\ : \https://ui-avatars.com/api/?name=\\}} style={{width:50, height:50, borderRadius:25, backgroundColor:'#e1e1e1'}}/>
                        <View style={{marginLeft:15}}>
                            <Text style={{fontSize:16, fontWeight:'bold', color:'#333'}}>{activeRide.captain_name || 'Searching for Captain...'}</Text>
                            <Text style={{fontSize:13, color:'#666', marginTop:2}}>{activeRide.captain_phone || 'Assigning soon'}</Text>
                        </View>
                    </View>;

const newBlock = {/* Captain & Vehicle Info */}
                    <View style={{backgroundColor:'#f9f9f9', padding:15, borderRadius:12, flexDirection:'row', alignItems:'center', justifyContent: 'space-between', marginBottom:15}}>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Image source={{uri: activeRide.driver_photo ? \https://milesgoride.com/uploads/\\ : \https://ui-avatars.com/api/?name=\\}} style={{width:50, height:50, borderRadius:25, backgroundColor:'#e1e1e1'}}/>
                            <View style={{marginLeft:15}}>
                                <Text style={{fontSize:16, fontWeight:'bold', color:'#333'}}>{activeRide.captain_name || 'Searching for Captain...'}</Text>
                                <Text style={{fontSize:13, color:'#666', marginTop:2}}>{activeRide.captain_phone || 'Assigning soon'}</Text>
                            </View>
                        </View>
                        
                        {activeRide.car_number && (
                            <View style={{alignItems: 'center'}}>
                                {activeRide.car_image ? (
                                    <Image source={{uri: \https://milesgoride.com/uploads/\\}} style={{width: 60, height: 40, borderRadius: 8, resizeMode: 'contain'}} />
                                ) : (
                                    <Icon name="car-side" size={24} color="#666" style={{marginBottom: 4}} />
                                )}
                                <View style={{backgroundColor: '#FFEB3B', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4, borderWidth: 1, borderColor: '#000'}}>
                                    <Text style={{fontSize: 10, fontWeight: 'bold', color: '#000'}}>{activeRide.car_number}</Text>
                                </View>
                            </View>
                        )}
                    </View>;

c2 = c2.replace(oldBlock, newBlock);

// 3. Patch HomeScreen.js to fetch driverLoc if empty but activeRide has it
const checkActiveOld = setActiveRide(ride);
                  if (ride) {;
const checkActiveNew = setActiveRide(ride);
                  if (ride && !driverLoc && ride.status !== 'completed' && ride.driver_lat && ride.driver_lng) {
                      setDriverLoc({ lat: parseFloat(ride.driver_lat), lng: parseFloat(ride.driver_lng) });
                  }
                  if (ride) {;
c2 = c2.replace(checkActiveOld, checkActiveNew);

fs.writeFileSync(f2, c2, 'utf8');
console.log('Patched successfully!');
