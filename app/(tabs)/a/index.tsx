import React, { useRef, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "react-native-paper";
import { useDesignSystem } from "../../../contexts/DesignSystemContext";
import { useScroll } from "../../../contexts/ScrollContext";
import ScrollTop from "../../../components/scrollTop";
import HomeHeader from "../../../components/a/header";

export default function Home() {
  const theme = useTheme();
  const { design } = useDesignSystem();
  const { handleScroll, registerScrollRef } = useScroll();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    registerScrollRef("a", scrollRef.current);
  }, [registerScrollRef]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "flex-start",
      }}
    >
      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
        alwaysBounceVertical={false}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: design.spacing["3xl"] * 2,
        }}
      >
        <HomeHeader />
      </ScrollView>

      <ScrollTop tabName="a" />
    </View>
  );
}
