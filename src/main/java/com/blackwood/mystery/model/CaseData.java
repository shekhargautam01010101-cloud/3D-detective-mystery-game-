package com.blackwood.mystery.model;

import java.util.List;

/** Server-owned, spoiler-safe case definition. Never shipped as a static client data file. */
public final class CaseData {
 private CaseData() {}
 public record Suspect(String id,String name,String role) {}
 public record Room(String id,String name) {}
 public record Clue(int id,String title,String description,String room,String pointsTo) {}
 public static final List<Suspect> SUSPECTS=List.of(new Suspect("rahul","Rahul","Business partner"),new Suspect("aman","Aman","Butler"),new Suspect("priya","Priya","Secretary"),new Suspect("karan","Karan","Nephew"));
 public static final List<Room> ROOMS=List.of(new Room("hall","Main Hall"),new Room("study","Study"),new Room("library","Library"),new Room("garden","Garden"),new Room("kitchen","Kitchen"),new Room("guest","Guest Room"),new Room("security","Security Room"));
 public static final List<Clue> CLUES=List.of(new Clue(1,"Stopped pocket watch","A pocket watch stopped at 9:40 PM, marking the time of death.","Study","time of death"),new Clue(2,"Torn will page","A torn page from a new will in the fireplace shows Karan was being cut out.","Study","Karan's motive"),new Clue(3,"Muddy boot prints","Prints lead from the Garden door to the Study.","Study","the garden route"),new Clue(4,"K initial cufflink","A cufflink bearing the initial K lies under the desk.","Study","Karan"),new Clue(5,"Gate log and CCTV","The gate log and CCTV place Rahul outside from 9:15 to 10:05 PM.","Security Room","Rahul is cleared"),new Clue(6,"Guest and phone records","Aman served 12 guests until 10 PM; Priya was on a recorded call from 9:20 to 9:55.","Guest Room","Aman and Priya are cleared"));
 public static Clue clue(int id){return CLUES.stream().filter(c->c.id()==id).findFirst().orElse(null);}
 public static String answer(String suspect,String question,boolean hasGate,boolean hasGuest){
  int q;try{q=Integer.parseInt(question);}catch(Exception e){q=0;}
  return switch(suspect+":"+q){
   case "rahul:1" -> hasGate?"The gate log confirms my call kept me outside from 9:15 to 10:05.":"I was outside the gate on a phone call.";
   case "rahul:2" -> "Arjun and I were business partners, though we disagreed about the estate.";
   case "rahul:3" -> "I saw no one enter the study.";
   case "aman:1" -> hasGuest?"The guest-room record supports it: I served all 12 guests until 10 PM.":"I was serving dinner to the guests all evening.";
   case "aman:2" -> "I served the Blackwood family for many years.";
   case "aman:3" -> "I noticed nothing unusual while serving dinner.";
   case "priya:1" -> hasGuest?"My recorded call ran from 9:20 to 9:55 PM, as the phone record shows.":"I was on a call in the guest room.";
   case "priya:2" -> "I was Arjun's secretary and knew about his new will.";
   case "priya:3" -> "I heard raised voices earlier, but cannot identify who they were.";
   case "karan:1" -> "I was in the library all evening. I knew nothing about any change to the will.";
   case "karan:2" -> "Arjun was my uncle. We were close, and I expected nothing from him.";
   default -> "I didn't see anything worth mentioning.";
  };
 }
}
